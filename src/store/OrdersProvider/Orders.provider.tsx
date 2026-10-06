import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { orderService } from '../../api';
import useQueryParams from '../../hooks/useQueryParams';
import { useIsCompanyAdmin } from '../../hooks/useRole';
import {
  Order,
  OrderMutationResponse,
  OrderOverview,
  orderPriorityArray,
  orderStatusArray,
} from '../../types/Order';
import OrdersContext, { SelectedOrderError } from './Orders.context';
import axios from 'axios';
import { Q_PARAM } from '../../util/constants';
import {
  SortCriteriaType,
  SortType,
} from '../../components/modals/filters/FiltersModal.component';
import { UpdatePaymentsResponse } from '../../types/Payment';

const FILTER_QUERY_KEYS: string[] = [
  ...orderStatusArray,
  ...orderPriorityArray,
  Q_PARAM.EXECUTION_STATUS,
  Q_PARAM.SEARCH_TERM,
  Q_PARAM.SORT_CRITERIA,
  Q_PARAM.SORT,
];

// Mutation endpoints return payments (and, for non-admins, amountPaid) as null.
// A null/undefined value means "not provided", so the known value is kept.
const mergeOrderResponse = (
  previous:
    | Partial<
        Pick<
          Order,
          'amountPaid' | 'payments' | 'note' | 'internalNote' | 'printFilesUrl'
        >
      >
    | undefined,
  response: OrderMutationResponse,
  isAdmin: boolean
): Order => {
  const merged: Order = {
    ...response,
    amountPaid: response.amountPaid ?? previous?.amountPaid ?? 0,
    payments: response.payments ?? previous?.payments,
    // undefined keeps the previous value, null clears it.
    printFilesUrl:
      response.printFilesUrl === undefined
        ? previous?.printFilesUrl
        : response.printFilesUrl,
  };
  // Non-admins take note/internalNote as-is: a null note means hidden.
  if (!isAdmin) return merged;
  // Admins: null becomes "" / false, while fields that are absent entirely
  // (undefined) must not overwrite the known values.
  return {
    ...merged,
    note:
      response.note === undefined ? previous?.note : (response.note ?? ''),
    internalNote:
      response.internalNote === undefined
        ? previous?.internalNote
        : (response.internalNote ?? false),
  };
};

const OrdersProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const { params: queryParams } = useQueryParams();
  const isAdmin = useIsCompanyAdmin();

  // Only the keys the list filters on: unrelated query params (for example the
  // one-shot `orderId` deep link) must not recreate fetchOrders, which would
  // refetch the list and reset it to the first page.
  const filterParamsKey = useMemo(
    () =>
      JSON.stringify(
        Object.entries(queryParams)
          .filter(([key]) => FILTER_QUERY_KEYS.includes(key))
          .sort(([a], [b]) => a.localeCompare(b))
      ),
    [queryParams]
  );
  const params = useMemo<Record<string, string>>(
    () => Object.fromEntries(JSON.parse(filterParamsKey)),
    [filterParamsKey]
  );

  const [orders, setOrders] = useState<OrderOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(-1);
  const [selectedOrderError, setSelectedOrderError] =
    useState<SelectedOrderError | null>(null);

  const [page, setPage] = useState(0);
  const lastPageValueRef = useRef<number>(page);
  const [total, setTotal] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [perPage, setPerPage] = useState(5);

  // Guards against late responses overwriting newer state.
  const selectedOrderIdRef = useRef<number>(-1);
  const orderVersionRef = useRef(0);
  const paymentsVersionRef = useRef(0);

  const mapOrderToOverview = useCallback((order: Order) => {
    const shippedHistoryStatus = order.statusHistory?.find(
      (x) => x.status === 'SHIPPED'
    );
    return {
      ...order,
      ...(shippedHistoryStatus && {
        postalCode: shippedHistoryStatus.postalCode,
        postalService: shippedHistoryStatus.postalService,
      }),
    };
  }, []);

  const mergeOrderIntoState = useCallback(
    (response: OrderMutationResponse, replaceSelected: boolean) => {
      setSelectedOrder((old) => {
        if (old?.id === response.id)
          return mergeOrderResponse(old, response, isAdmin);
        return replaceSelected
          ? mergeOrderResponse(undefined, response, isAdmin)
          : old;
      });
      setOrders((old) =>
        old.map((row) =>
          row.id === response.id
            ? mapOrderToOverview(
                mergeOrderResponse(
                  row as OrderOverview & Partial<Order>,
                  response,
                  isAdmin
                )
              )
            : row
        )
      );
    },
    [isAdmin, mapOrderToOverview]
  );

  const applyOrderResponse = useCallback(
    (response: OrderMutationResponse) => {
      orderVersionRef.current += 1;
      mergeOrderIntoState(response, false);
    },
    [mergeOrderIntoState]
  );

  const updatePaymentInOverview = useCallback(
    (orderId: number, paymentResponse: UpdatePaymentsResponse) => {
      orderVersionRef.current += 1;
      paymentsVersionRef.current += 1;

      setOrders((old) =>
        old.map((order) =>
          order.id === orderId
            ? {
                ...order,
                amountLeftToPay: paymentResponse.amountLeftToPay,
                amountPaid: paymentResponse.amountPaid,
                payments: paymentResponse.payments,
              }
            : order
        )
      );
      setSelectedOrder((old) =>
        old && old.id === orderId
          ? {
              ...old,
              amountLeftToPay: paymentResponse.amountLeftToPay,
              amountPaid: paymentResponse.amountPaid,
              payments: paymentResponse.payments,
            }
          : old
      );
    },
    []
  );

  const fetchSelectedOrderPayments = useCallback(async (orderId: number) => {
    const paymentsVersion = paymentsVersionRef.current;
    const payments = await orderService.getPayments(orderId);
    if (
      selectedOrderIdRef.current !== orderId ||
      paymentsVersion !== paymentsVersionRef.current
    ) {
      return;
    }
    setSelectedOrder((old) =>
      old?.id === orderId ? { ...old, payments } : old
    );
  }, []);

  const removeOrderInOverviewList = useCallback((orderToRemove: Order) => {
    setOrders((old) => old.filter((order) => order.id !== orderToRemove.id));
    setTotalElements((old) => old - 1);
  }, []);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const isPageUnchanged = lastPageValueRef.current === page;

      const statuses = Object.keys(params).filter((key) =>
        orderStatusArray.includes(key)
      );

      const priorities = Object.keys(params).filter((key) =>
        orderPriorityArray.includes(key)
      );

      const executionStatuses = params[Q_PARAM.EXECUTION_STATUS];

      const response = await orderService.fetchPaginated({
        statuses,
        priorities,
        searchTerm: params[Q_PARAM.SEARCH_TERM],
        sortCriteria: params[Q_PARAM.SORT_CRITERIA] as SortCriteriaType,
        sort: params[Q_PARAM.SORT] as SortType,
        executionStatuses:
          executionStatuses === 'ALL'
            ? ['ACTIVE', 'PAUSED', 'ARCHIVED', 'CANCELED']
            : executionStatuses === 'ARCHIVED'
              ? ['ARCHIVED', 'CANCELED']
              : [],
        page: isPageUnchanged ? 0 : page,
        perPage,
      });
      setPage(response.page);
      setPerPage(response.perPage);
      setTotal(response.total);
      setTotalElements(response.totalElements);
      setOrders(response.data);
      lastPageValueRef.current = response.page;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [page, params, perPage]);

  const fetchSelectedOrder = useCallback(
    async (orderId: number) => {
      const orderVersion = orderVersionRef.current;
      const paymentsVersion = paymentsVersionRef.current;
      try {
        setIsLoading(true);
        const response = await orderService.getOrder(orderId);
        const isStale =
          selectedOrderIdRef.current !== orderId ||
          orderVersion !== orderVersionRef.current ||
          paymentsVersion !== paymentsVersionRef.current;
        if (!isStale) mergeOrderIntoState(response, true);
      } catch (error) {
        console.error(error);
        if (selectedOrderIdRef.current === orderId) {
          setSelectedOrderError({
            orderId,
            status: axios.isAxiosError(error)
              ? error.response?.status
              : undefined,
          });
          // Order no longer exists (e.g. merged into another): don't keep a stale one open.
          setSelectedOrder((old) => (old?.id === orderId ? null : old));
        }
      } finally {
        if (selectedOrderIdRef.current === orderId) setIsLoading(false);
      }
    },
    [mergeOrderIntoState]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, page, perPage]);

  useEffect(() => {
    selectedOrderIdRef.current = selectedOrderId;
    setSelectedOrderError(null);
    if (selectedOrderId > 0) {
      fetchSelectedOrder(selectedOrderId);
    } else {
      setSelectedOrder(null);
    }
  }, [fetchSelectedOrder, selectedOrderId]);

  const value = useMemo(
    () => ({
      orders,
      page,
      total,
      totalElements,
      isLoading,
      selectedOrder,
      selectedOrderError,
      applyOrderResponse,
      removeOrderInOverviewList,
      fetchOrders,
      fetchSelectedOrderPayments,
      setSelectedOrder,
      setPage,
      setSelectedOrderId,
      updatePaymentInOverview,
    }),
    [
      orders,
      page,
      total,
      totalElements,
      isLoading,
      selectedOrder,
      selectedOrderError,
      applyOrderResponse,
      removeOrderInOverviewList,
      fetchOrders,
      fetchSelectedOrderPayments,
      updatePaymentInOverview,
    ]
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
};

export default OrdersProvider;

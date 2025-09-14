import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import companyService from '../../api/services/companies';
import {
  SortCriteriaType,
  SortType,
} from '../../components/modals/filters/FiltersModal.component';
import useQueryParams from '../../hooks/useQueryParams';
import { Company } from '../../types/Company';
import {
  Order,
  OrderOverview,
  orderPriorityArray,
  orderStatusArray,
  OrderStatusHistory,
} from '../../types/Order';
import { Q_PARAM } from '../../util/constants';
import CompanyContext from './Company.context';
import { orderService } from '../../api';
import { Payment, UpdatePaymentsResponse } from '../../types/Payment';

export type PaginationConfig = {
  page: number;
  perPage: number;
  total: number;
  totalElements: number;
};

const CompanyProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const { id } = useParams<{ id: string }>();
  const { params } = useQueryParams();
  const [company, setCompany] = useState<Company | undefined>();
  const [orders, setOrders] = useState<OrderOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(-1);

  const [statusHistory, setStatusHistory] = useState<OrderStatusHistory[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const [payments, setPayments] = useState<Payment[]>([]);
  const [arePaymentsLoading, setArePaymentsLoading] = useState(false);

  const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>({
    page: 0,
    perPage: 5,
    total: 0,
    totalElements: 0,
  });
  const lastPageValueRef = useRef<number>(paginationConfig.page);

  const fetchOrders = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);

    try {
      const isPageUnchanged =
        lastPageValueRef.current === paginationConfig?.page;

      const statuses = Object.keys(params).filter((key) =>
        orderStatusArray.includes(key)
      );

      const priorities = Object.keys(params).filter((key) =>
        orderPriorityArray.includes(key)
      );

      const executionStatuses = params[Q_PARAM.EXECUTION_STATUS];

      const response = await companyService.getCompanyOrders(+id, {
        statuses,
        priorities,
        searchTerm: params[Q_PARAM.SEARCH_TERM],
        sortCriteria: params[Q_PARAM.SORT_CRITERIA] as SortCriteriaType,
        sort: params[Q_PARAM.SORT] as SortType,
        executionStatuses:
          executionStatuses === 'ARCHIVED' ? ['ARCHIVED', 'CANCELED'] : [],
        page: isPageUnchanged ? 0 : paginationConfig?.page,
        perPage: paginationConfig?.perPage,
      });

      setPaginationConfig({ ...response });
      setOrders(response.data);
      lastPageValueRef.current = response.page;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [id, paginationConfig?.page, paginationConfig?.perPage, params]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const mapOrderToOverview = useCallback((order: Order) => {
    const shippedHistoryStatus = order.statusHistory.find(
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

  const updateOrderInOverviewList = useCallback(
    (orderToUpdate: Order) =>
      setOrders((old) =>
        old.map((order) =>
          order.id === orderToUpdate.id
            ? mapOrderToOverview(orderToUpdate)
            : order
        )
      ),
    [mapOrderToOverview]
  );

  const removeOrderInOverviewList = useCallback((orderToRemove: Order) => {
    setOrders((old) => old.filter((order) => order.id !== orderToRemove.id));
    setPaginationConfig((old) => ({
      ...old,
      totalElements: old.totalElements - 1,
    }));
  }, []);

  // todo change to fetch more details
  const fetchCompany = useCallback(async () => {
    if (!id) return;

    const response = await companyService.getCompany(+id);
    setCompany(response);
  }, [id]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const changeSelectedOrderId = useCallback((newId: number) => {
    setSelectedOrderId(newId);
  }, []);

  const updatePaginationConfig = useCallback(
    (newPaginationConfig: PaginationConfig) => {
      setPaginationConfig(newPaginationConfig);
    },
    []
  );

  const updatePaymentInOverview = useCallback(
    (paymentResponse: UpdatePaymentsResponse) => {
      const orderToUpdate = orders.find((x) => x.id === selectedOrder?.id);
      if (!orderToUpdate) return;

      setPayments(paymentResponse.payments);
      setOrders((old) =>
        old.map((order) =>
          order.id === orderToUpdate.id
            ? {
                ...orderToUpdate,
                postalCode: order?.postalCode,
                postalService: order?.postalService,
                amountLeftToPay: paymentResponse.amountLeftToPay,
                payments: paymentResponse.payments,
              }
            : order
        )
      );
      setSelectedOrder((old) =>
        old
          ? {
              ...old,
              amountLeftToPay: paymentResponse.amountLeftToPay,
              amountPaid: paymentResponse.amountPaid,
            }
          : null
      );
    },
    [orders, selectedOrder?.id]
  );

  const fetchSelectedOrder = useCallback(
    async (orderId: number) => {
      try {
        setIsLoading(true);
        const response = await orderService.getOrder(orderId);
        setSelectedOrder(response);
        updateOrderInOverviewList(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [updateOrderInOverviewList]
  );

  useEffect(() => {
    setStatusHistory([]);
    setPayments([]);
    if (selectedOrderId > 0) {
      fetchSelectedOrder(selectedOrderId);
    } else {
      setSelectedOrder(null);
    }
  }, [fetchSelectedOrder, selectedOrderId]);

  const fetchStatusHistory = useCallback(async () => {
    if (statusHistory.length > 0) return;

    try {
      setIsHistoryLoading(true);
      const data = await orderService.getHistory(selectedOrderId);
      setStatusHistory(data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [selectedOrderId, statusHistory.length]);

  const updateStatusHistory = useCallback(
    (newStatusHistory: OrderStatusHistory[]) => {
      setStatusHistory(newStatusHistory);
    },
    []
  );

  const fetchPayments = useCallback(async () => {
    if (payments.length > 0) return;

    try {
      setArePaymentsLoading(true);
      const data = await orderService.getPayments(selectedOrderId);
      setPayments(data);
    } catch (e) {
      console.log(e);
    } finally {
      setArePaymentsLoading(false);
    }
  }, [payments.length, selectedOrderId]);

  return (
    <CompanyContext.Provider
      value={{
        orders,
        company,
        selectedOrder,
        paginationConfig,
        isLoading,
        statusHistory,
        isHistoryLoading,
        payments,
        arePaymentsLoading,
        updateOrderInOverviewList,
        removeOrderInOverviewList,
        changeSelectedOrderId,
        updatePaginationConfig,
        setSelectedOrder,
        setSelectedOrderId,
        fetchOrders,
        fetchStatusHistory,
        fetchPayments,
        updateStatusHistory,
        updatePaymentInOverview
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;

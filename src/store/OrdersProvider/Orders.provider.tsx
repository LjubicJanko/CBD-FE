import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { orderService } from '../../api';
import useQueryParams from '../../hooks/useQueryParams';
import { Order, OrderOverview, orderStatusArray } from '../../types/Order';
import OrdersContext from './Orders.context';
import { Q_PARAM } from '../../util/constants';
import {
  SortCriteriaType,
  SortType,
} from '../../components/modals/filters/FiltersModal.component';

const OrdersProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const { params } = useQueryParams();

  const [orders, setOrders] = useState<OrderOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(-1);
  const [page, setPage] = useState(0);
  const lastPageValueRef = useRef<number>(page);
  const [total, setTotal] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [perPage, setPerPage] = useState(5);

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
    setTotalElements((old) => old - 1);
  }, []);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const isPageUnchanged = lastPageValueRef.current === page;

      const statuses = Object.keys(params).filter((key) =>
        orderStatusArray.includes(key)
      );

      const executionStatuses = params[Q_PARAM.EXECUTION_STATUS];

      const response = await orderService.fetchPaginated({
        statuses,
        searchTerm: params[Q_PARAM.SEARCH_TERM],
        sortCriteria: params[Q_PARAM.SORT_CRITERIA] as SortCriteriaType,
        sort: params[Q_PARAM.SORT] as SortType,
        executionStatuses:
          executionStatuses === 'ARCHIVED' ? ['ARCHIVED', 'CANCELED'] : [],
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
      try {
        const response = await orderService.getOrder(orderId);
        setSelectedOrder(response);
        updateOrderInOverviewList(response);
      } catch (error) {
        console.error(error);
      }
    },
    [updateOrderInOverviewList]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, page, perPage]);

  useEffect(() => {
    if (selectedOrderId > 0) {
      fetchSelectedOrder(selectedOrderId);
    } else {
      setSelectedOrder(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrderId]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        page,
        total,
        totalElements,
        isLoading,
        selectedOrder,
        updateOrderInOverviewList,
        removeOrderInOverviewList,
        fetchOrders,
        setSelectedOrder,
        setPage,
        setSelectedOrderId,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersProvider;

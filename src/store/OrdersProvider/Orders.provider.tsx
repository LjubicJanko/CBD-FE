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
  const [shouldShowArchived, setShouldShowArchived] = useState(false);

  const updateOrderInOverviewList = useCallback((orderToUpdate: Order) => {
    setOrders((old) =>
      old.map((order) =>
        order.id === orderToUpdate.id ? (orderToUpdate as OrderOverview) : order
      )
    );
  }, []);


  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const isPageUnchanged = lastPageValueRef.current === page;

      const statuses = Object.keys(params).filter((key) =>
        orderStatusArray.includes(key)
      );
      const response = await orderService.getAllPaginated({
        statuses,
        sort: params['sort'] as 'asc' | 'desc',
        executionStatuses: shouldShowArchived ? ['ARCHIVED', 'CANCELED'] : [],
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
  }, [page, params, perPage, shouldShowArchived]);

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

  const handleSearch = useCallback(
    async (searchTerm: string) => {
      try {
        setIsLoading(true);
        const response = await orderService.searchOrders({
          searchTerm,
          page,
          perPage,
        });
        setSelectedOrderId(-1);
        setPage(response.page);
        setPerPage(response.perPage);
        setTotal(response.total);
        setTotalElements(response.totalElements);
        setOrders(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [page, perPage]
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
        handleSearch,
        fetchOrders,
        setSelectedOrder,
        setPage,
        setSelectedOrderId,
        setShouldShowArchived,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersProvider;

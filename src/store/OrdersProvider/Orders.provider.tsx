import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { orderService } from '../../api';
import useQueryParams from '../../hooks/useQueryParams';
import { Order, OrderOverview } from '../../types/Order';
import OrdersContext from './Orders.context';

const OrdersProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const { params } = useQueryParams();

  const [orders, setOrders] = useState<OrderOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(-1);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(5);

  const handleSearch = useCallback(
    async (query: string) => {
      try {
        setIsLoading(true);
        const statuses = Object.keys(params);
        const response = await orderService.searchOrders({
          query,
          page,
          perPage,
        });
        setSelectedOrderId(-1);
        setOrders(response);
        setPage(response.page);
        setPerPage(response.perPage);
        setTotal(response.total);
        setOrders(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [page, params, perPage]
  );

  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        setIsLoading(true);
        const statuses = Object.keys(params);
        const response = await orderService.getAllPaginated({
          statuses,
          page,
          perPage,
        });
        setPage(response.page);
        setPerPage(response.perPage);
        setTotal(response.total);
        setOrders(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiltered();
  }, [page, params, perPage]);

  useEffect(() => {
    const fetchSelectedOrder = async (orderId: number) => {
      try {
        const response = await orderService.getOrder(orderId);
        setSelectedOrder(response);
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedOrderId > 0) {
      fetchSelectedOrder(selectedOrderId);
    } else {
      setSelectedOrder(null);
    }
  }, [selectedOrderId]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        page,
        total,
        handleSearch,
        setPage,
        selectedOrder,
        setSelectedOrderId,
        isLoading,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersProvider;

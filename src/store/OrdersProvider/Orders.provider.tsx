import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import OrdersContext from './Orders.context';
import { orderService } from '../../api';
import { Order } from '../../types/Order';
import useQueryParams from '../../hooks/useQueryParams';

const OrdersProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const { params } = useQueryParams();

  const handleSearch = useCallback(async (query: string) => {
    try {
      const response: Order[] = await orderService.searchOrders(query);
      setSelectedOrder(0);
      setOrders(response);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        setIsLoading(true);
        const filters = Object.keys(params);
        const response: Order[] = await orderService.getAll(filters);
        setOrders(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiltered();
  }, [params]);

  return (
    <OrdersContext.Provider value={{ orders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersProvider;

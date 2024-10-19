import { createContext } from 'react';
import { Order, OrderOverview } from '../../types/Order';

interface OrdersContext {
  orders: OrderOverview[];
  page: number;
  total: number;
  isLoading: boolean;
  selectedOrder: Order | null;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  handleSearch: (query: string) => Promise<void>;
  setSelectedOrderId: React.Dispatch<React.SetStateAction<number>>;
}

export default createContext<OrdersContext>({
  orders: [],
  page: 0,
  total: 0,
  isLoading: false,
  selectedOrder: null,
  setPage: () => {},
  handleSearch: () => new Promise(() => {}),
  setSelectedOrderId: () => {},
});

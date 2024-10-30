import { createContext } from 'react';
import { Order, OrderOverview } from '../../types/Order';

interface OrdersContext {
  orders: OrderOverview[];
  page: number;
  total: number;
  totalElements: number;
  isLoading: boolean;
  selectedOrder: Order | null;
  updateOrderInOverviewList: (orderToUpdate: Order) => void;
  fetchOrders: () => Promise<void>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  handleSearch: (query: string) => Promise<void>;
  setSelectedOrderId: React.Dispatch<React.SetStateAction<number>>;
}

export default createContext<OrdersContext>({
  orders: [],
  page: 0,
  total: 0,
  totalElements: 0,
  isLoading: false,
  selectedOrder: null,
  updateOrderInOverviewList: () => {},
  fetchOrders: () => new Promise(() => {}),
  setPage: () => {},
  handleSearch: () => new Promise(() => {}),
  setSelectedOrderId: () => {},
});

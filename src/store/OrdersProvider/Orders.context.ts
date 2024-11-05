import { createContext, Dispatch, SetStateAction } from 'react';
import { Order, OrderOverview } from '../../types/Order';

interface OrdersContext {
  orders: OrderOverview[];
  page: number;
  total: number;
  totalElements: number;
  isLoading: boolean;
  selectedOrder: Order | null;
  isOrderUpdating: boolean;
  setIsOrderUpdating: Dispatch<SetStateAction<boolean>>;
  updateOrderInOverviewList: (orderToUpdate: Order) => void;
  fetchOrders: () => Promise<void>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSelectedOrder: Dispatch<SetStateAction<Order | null>>;
  handleSearch: (query: string) => Promise<void>;
  setSelectedOrderId: React.Dispatch<React.SetStateAction<number>>;
  setShouldShowArchived: Dispatch<SetStateAction<boolean>>;
}

export default createContext<OrdersContext>({
  orders: [],
  page: 0,
  total: 0,
  totalElements: 0,
  isLoading: false,
  selectedOrder: null,
  isOrderUpdating: false,
  setIsOrderUpdating: () => {},
  updateOrderInOverviewList: () => {},
  fetchOrders: () => new Promise(() => {}),
  setPage: () => {},
  setSelectedOrder: () => {},
  handleSearch: () => new Promise(() => {}),
  setSelectedOrderId: () => {},
  setShouldShowArchived: () => {},
});

import { createContext, Dispatch, SetStateAction } from 'react';
import { Order, OrderOverview, OrderStatusHistory } from '../../types/Order';
import { UpdatePaymentsResponse, Payment } from '../../types/Payment';

interface OrdersContext {
  orders: OrderOverview[];
  page: number;
  total: number;
  totalElements: number;
  isLoading: boolean;
  selectedOrder: Order | null;
  statusHistory: OrderStatusHistory[];
  isHistoryLoading: boolean;
  payments: Payment[];
  arePaymentsLoading: boolean;
  updateOrderInOverviewList: (orderToUpdate: Order) => void;
  removeOrderInOverviewList: (orderToUpdate: Order) => void;
  fetchOrders: () => Promise<void>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSelectedOrder: Dispatch<SetStateAction<Order | null>>;
  setSelectedOrderId: React.Dispatch<React.SetStateAction<number>>;
  fetchStatusHistory: (orderId: number) => void;
  fetchPayments: (orderId: number) => void;
  updateStatusHistory: (newStatusHistory: OrderStatusHistory[]) => void;
  updatePaymentInOverview: (payment: UpdatePaymentsResponse) => void;
}

export default createContext<OrdersContext>({
  orders: [],
  page: 0,
  total: 0,
  totalElements: 0,
  isLoading: false,
  selectedOrder: null,
  statusHistory: [],
  isHistoryLoading: false,
  payments: [],
  arePaymentsLoading: false,
  updateOrderInOverviewList: () => {},
  removeOrderInOverviewList: () => {},
  fetchOrders: () => new Promise(() => {}),
  setPage: () => {},
  setSelectedOrder: () => {},
  setSelectedOrderId: () => {},
  fetchStatusHistory: () => {},
  fetchPayments: () => {},
  updateStatusHistory: () => {},
  updatePaymentInOverview: () => {},
});

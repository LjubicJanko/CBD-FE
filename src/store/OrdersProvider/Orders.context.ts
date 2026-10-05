import { createContext, Dispatch, SetStateAction } from 'react';
import { Order, OrderMutationResponse, OrderOverview } from '../../types/Order';
import { UpdatePaymentsResponse } from '../../types/Payment';

interface OrdersContext {
  orders: OrderOverview[];
  page: number;
  total: number;
  totalElements: number;
  isLoading: boolean;
  selectedOrder: Order | null;
  applyOrderResponse: (response: OrderMutationResponse) => void;
  removeOrderInOverviewList: (orderToUpdate: Order) => void;
  fetchOrders: () => Promise<void>;
  fetchSelectedOrderPayments: (orderId: number) => Promise<void>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSelectedOrder: Dispatch<SetStateAction<Order | null>>;
  setSelectedOrderId: React.Dispatch<React.SetStateAction<number>>;
  updatePaymentInOverview: (
    orderId: number,
    payment: UpdatePaymentsResponse
  ) => void;
}

export default createContext<OrdersContext>({
  orders: [],
  page: 0,
  total: 0,
  totalElements: 0,
  isLoading: false,
  selectedOrder: null,
  applyOrderResponse: () => {},
  removeOrderInOverviewList: () => {},
  fetchOrders: () => new Promise(() => {}),
  fetchSelectedOrderPayments: () => new Promise(() => {}),
  setPage: () => {},
  setSelectedOrder: () => {},
  setSelectedOrderId: () => {},
  updatePaymentInOverview: () => {},
});

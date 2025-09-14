import { createContext, Dispatch, SetStateAction } from 'react';
import { Company } from '../../types/Company';
import { Order, OrderOverview, OrderStatusHistory } from '../../types/Order';
import { Payment, UpdatePaymentsResponse } from '../../types/Payment';
import { PaginationConfig } from './Company.provider';

interface CompanyContext {
  company?: Company;
  orders: OrderOverview[];
  selectedOrder: Order | null;
  paginationConfig: {
    page: number;
    perPage: number;
    total: number;
    totalElements: number;
  };
  isLoading: boolean;
  statusHistory: OrderStatusHistory[];
  isHistoryLoading: boolean;
  payments: Payment[];
  arePaymentsLoading: boolean;
  updateOrderInOverviewList: (orderToUpdate: Order) => void;
  removeOrderInOverviewList: (orderToUpdate: Order) => void;
  changeSelectedOrderId: (newId: number) => void;
  setSelectedOrder: Dispatch<SetStateAction<Order | null>>;
  setSelectedOrderId: React.Dispatch<React.SetStateAction<number>>;
  updatePaginationConfig: (newPaginationConfig: PaginationConfig) => void;
  fetchOrders: () => Promise<void>;
  fetchStatusHistory: (orderId: number) => void;
  fetchPayments: (orderId: number) => void;
  updateStatusHistory: (newStatusHistory: OrderStatusHistory[]) => void;
  updatePaymentInOverview: (payment: UpdatePaymentsResponse) => void;
}

export default createContext<CompanyContext>({
  orders: [],
  company: undefined,
  selectedOrder: null,
  paginationConfig: {
    page: 0,
    perPage: 5,
    total: 0,
    totalElements: 0,
  },
  isLoading: false,
  statusHistory: [],
  isHistoryLoading: false,
  payments: [],
  arePaymentsLoading: false,
  updateOrderInOverviewList: () => {},
  removeOrderInOverviewList: () => {},
  changeSelectedOrderId: () => {},
  setSelectedOrder: () => {},
  setSelectedOrderId: () => {},
  updatePaginationConfig: () => {},
  fetchOrders: () => new Promise(() => {}),
  fetchStatusHistory: () => {},
  fetchPayments: () => {},
  updateStatusHistory: () => {},
  updatePaymentInOverview: () => {},
});

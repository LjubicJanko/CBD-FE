import { createContext } from 'react';
import { Order, OrderOverview } from '../../types/Order';
import { Company } from '../../types/Company';
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
  changeSelectedOrderId: (newId: number) => void;
  updatePaginationConfig: (newPaginationConfig: PaginationConfig) => void;
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
  changeSelectedOrderId: () => {},
  updatePaginationConfig: () => {},
});

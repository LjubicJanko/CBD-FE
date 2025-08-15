import { createContext } from 'react';
import { OrderOverview } from '../../types/Order';
import { Company } from '../../types/Company';

interface CompanyContext {
  company?: Company;
  orders: OrderOverview[];
}

// eslint-disable-next-line react-refresh/only-export-components
export default createContext<CompanyContext>({
  orders: [],
  company: undefined
});

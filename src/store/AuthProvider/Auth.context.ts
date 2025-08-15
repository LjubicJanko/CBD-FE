import { createContext, Dispatch, SetStateAction } from 'react';
import { AuthData, LoginData } from '../../types/Auth';
import { CompanyOverview } from '../../types/Company';

interface AuthContext {
  token: string;
  authData: Omit<AuthData, 'token'> | null;
  isSuperAdmin: boolean;
  isLoading?: boolean;
  companiesInfo?: CompanyOverview[];
  setCompaniesInfo: Dispatch<SetStateAction<CompanyOverview[]>>;
  login: (
    data: LoginData,
    navigate: (path: string) => void
  ) => Promise<boolean>;
  logout: (navigate: (path: string) => void) => void;
}

export default createContext<AuthContext>({
  token: '',
  authData: null,
  isLoading: false,
  isSuperAdmin: false,
  companiesInfo: [],
  setCompaniesInfo: () => {},
  login: async () => false,
  logout: () => {},
});

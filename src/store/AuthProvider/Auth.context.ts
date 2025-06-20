import { createContext } from 'react';
import { AuthData, LoginData } from '../../types/Auth';

interface AuthContext {
  token: string;
  authData: Omit<AuthData, 'token'> | null;
  isLoading: boolean;
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
  login: async () => false,
  logout: () => {},
});

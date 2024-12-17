import { createContext } from 'react';
import { AuthData, LoginData } from '../../types/Auth';

interface AuthContext {
  token: string;
  authData: Omit<AuthData, 'token'> | null;
  login: (
    data: LoginData,
    navigate: (path: string) => void
  ) => Promise<boolean>;
  logout: (navigate: (path: string) => void) => void;
}

export default createContext<AuthContext>({
  token: '',
  authData: null,
  login: async () => false,
  logout: () => {},
});

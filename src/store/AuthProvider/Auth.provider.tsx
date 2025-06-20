import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import AuthContext from './Auth.context';
import localStorageService from '../../services/localStorage.service';
import { authService } from '../../api';
import { AuthData, LoginData } from '../../types/Auth';
import authBus from '../../services/bus';

const AuthProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authData, setAuthData] = useState<Omit<AuthData, 'token'> | null>(
    localStorageService.authData
  );
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (
      data: LoginData,
      navigate: (path: string) => void
    ): Promise<boolean> => {
      let status = false;
      try {
        setIsLoading(true);
        const response = await authService.login(data);
        const { token, id, roles, privileges, name, username } = response;
        setToken(token);
        setAuthData({ id, roles, privileges, name, username });
        localStorageService.saveData(response);
        status = true;
        navigate('/dashboard');
      } catch (error) {
        console.error(error);
        status = false;
      } finally {
        setIsLoading(false);
      }

      return status;
    },
    []
  );

  const logout = useCallback((navigate?: (path: string) => void) => {
    try {
      setToken('');
      setAuthData(null);
      localStorageService.clearData();
      navigate && navigate('/login');
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const onLogout = () => logout();
    authBus.on('token-expired', onLogout);

    return () => authBus.off('token-expired', onLogout);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ token, authData, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import { PropsWithChildren, useCallback, useState } from 'react';
import AuthContext from './Auth.context';
import localStorageService from '../../services/localStorage.service';
import { authService } from '../../api';
import { AuthData, LoginData, RegisterData } from '../../types/Auth';

const AuthProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authData, setAuthData] = useState<Omit<AuthData, 'token'> | null>(
    localStorageService.authData
  );

  const login = useCallback(
    async (
      data: LoginData,
      navigate: (path: string) => void
    ): Promise<boolean> => {
      let status = false;
      try {
        const response = await authService.login(data);
        const { token, id, roles, privileges } = response;
        setToken(token);
        setAuthData({ id, roles, privileges });
        localStorageService.saveData(response);
        status = true;
        navigate('/dashboard');
      } catch (error) {
        console.error(error);
        status = false;
      }

      return status;
    },
    []
  );

  const signup = useCallback(async (data: RegisterData): Promise<boolean> => {
    console.log(`register with ${data.password}`);
    let status = false;
    try {
      await authService.signup(data);
      status = true;
      alert('success');
    } catch (error) {
      console.error(error);
      status = false;
    }

    return status;
  }, []);

  const logout = useCallback((navigate: (path: string) => void) => {
    try {
      setToken('');
      setAuthData(null);
      localStorageService.clearData();
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, authData, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

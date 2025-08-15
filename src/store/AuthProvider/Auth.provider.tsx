import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import AuthContext from './Auth.context';
import localStorageService from '../../services/localStorage.service';
import { authService } from '../../api';
import { AuthData, LoginData } from '../../types/Auth';
import authBus from '../../services/bus';
import { CompanyOverview } from '../../types/Company';

const AuthProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authData, setAuthData] = useState<Omit<AuthData, 'token'> | null>(
    localStorageService.authData
  );
  const [companiesInfo, setCompaniesInfo] = useState<CompanyOverview[]>(localStorageService.companiesInfo);
  const [isSuperAdmin, setIsSuperAdmin] = useState(
    localStorageService.authData?.isSuperAdmin
  );
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (
      data: LoginData,
      navigate: (path: string) => void
    ): Promise<boolean> => {
      let status = false;
      setIsLoading(true);
      try {
        const response = await authService.login(data);
        const { token, id, roles, privileges, name, username, companyIds } =
          response;
        setToken(token);
        const _isSuperAdmin = roles.includes('super_admin');
        setAuthData({
          id,
          roles,
          privileges,
          name,
          username,
          companyIds,
          isSuperAdmin: _isSuperAdmin,
        });
        localStorageService.saveData({
          ...response,
          isSuperAdmin: _isSuperAdmin,
        });
        setIsSuperAdmin(_isSuperAdmin);
        status = true;
        navigate('/companies-overview');
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
      navigate?.('/login');
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
    <AuthContext.Provider
      value={{
        token,
        isSuperAdmin,
        authData,
        isLoading,
        companiesInfo,
        setCompaniesInfo,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

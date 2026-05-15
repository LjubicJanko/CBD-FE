import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import AuthContext from './Auth.context';
import localStorageService from '../../services/localStorage.service';
import { authService } from '../../api';
import { AuthData, LoginData } from '../../types/Auth';
import authBus from '../../services/bus';

// TODO remove after 2.2 — one-time migration to clear cached auth payloads
// from before the multi-tenant rename (missing `superadmin` field or carrying
// the old `'admin'` role). Once the install base has rolled forward this can
// be deleted along with its usage in the useState initializer below.
const isStaleAuthShape = (
  cached: Omit<AuthData, 'token'> | null
): boolean => {
  if (!cached) return false;
  if (typeof (cached as { superadmin?: unknown }).superadmin === 'undefined') {
    return true;
  }
  if (Array.isArray(cached.roles) && (cached.roles as string[]).includes('admin')) {
    return true;
  }
  return false;
};

const AuthProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [token, setToken] = useState(() => {
    const cached = localStorageService.authData;
    if (isStaleAuthShape(cached)) {
      localStorageService.clearData();
      return '';
    }
    return localStorageService.token || '';
  });
  const [authData, setAuthData] = useState<Omit<AuthData, 'token'> | null>(
    () => localStorageService.authData
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
        const { token, id, roles, privileges, name, username, tenantId, tenantSlug, tenantLogoUrl, superadmin } = response;
        setToken(token);
        setAuthData({ id, roles, privileges, name, username, tenantId, tenantSlug, tenantLogoUrl, superadmin });
        localStorageService.saveData(response);
        // Always reset the selected-tenant keys on login: a previous superadmin
        // session in this browser may have left selectedTenantId / Slug behind,
        // which would otherwise leak into a subsequent non-superadmin session.
        localStorageService.clearSelectedTenant();
        status = true;
        navigate(superadmin ? '/select-tenant' : '/dashboard');
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

  const logout = useCallback(() => {
    try {
      // Read the tenant slug before clearData wipes it so client admins land
      // back on their own tenant's public homepage (not the VITE_TENANT_SLUG
      // fallback).
      const slug = localStorageService.authData?.tenantSlug ?? null;
      localStorageService.clearData();
      // Hard navigation rather than react-router's navigate: a SPA navigate
      // races with PrivateRouteWrapper, which on the next render sees the
      // cleared token and bounces to '/' (then env-redirects to /cbd) before
      // our /<slug> transition can apply. Hard-nav also tears down any
      // in-memory tenant state, matching handleTenantSwitch in Header.
      window.location.href = slug ? `/${slug}` : '/';
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    authBus.on('token-expired', logout);

    return () => authBus.off('token-expired', logout);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ token, authData, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

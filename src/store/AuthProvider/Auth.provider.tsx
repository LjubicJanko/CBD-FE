import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import AuthContext from './Auth.context';
import localStorageService from '../../services/localStorage.service';
import { authService } from '../../api';
import { AuthData, LoginData } from '../../types/Auth';
import authBus from '../../services/bus';
import { firstEnabledModuleRoute } from '../../util/features';

// TODO remove after 2.2, one-time migration to clear cached auth payloads
// from before the multi-tenant rename (missing `superadmin` field or carrying
// the old `'admin'` role) and from before the premium-features rollout (missing
// `features`). Without the `features` check, an already-logged-in user keeps a
// cached payload with no features, so every module gates off and FeatureRoute
// strands them on /profile, with a still-valid token, nothing prompts a
// re-login. Forcing re-login refreshes the payload. Once the install base has
// rolled forward this can be deleted along with its usage in the useState
// initializer below.
//
// Also covers every tenant brand-color field (accent/background/text/muted/
// subtle): without this, a user logged in before a given color field shipped
// keeps a cached payload simply missing that key, so their tenant's real
// color never applies (silently falls back to the default palette) until an
// unrelated event forces a re-login. Checked by key presence (`in`), not by
// value, since `null` is a legitimate "tenant has no override" value and
// must NOT be treated as stale.
const TENANT_COLOR_KEYS = [
  'tenantAccentColor',
  'tenantBackgroundColor',
  'tenantTextColor',
  'tenantMutedTextColor',
  'tenantSubtleTextColor',
] as const;

const isStaleAuthShape = (
  cached: Omit<AuthData, 'token'> | null
): boolean => {
  if (!cached) return false;
  if (typeof (cached as { superadmin?: unknown }).superadmin === 'undefined') {
    return true;
  }
  if (!Array.isArray(cached.features)) {
    return true;
  }
  if (Array.isArray(cached.roles) && (cached.roles as string[]).includes('admin')) {
    return true;
  }
  if (TENANT_COLOR_KEYS.some((key) => !(key in cached))) {
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
        // Destructure only what's used directly below; everything else
        // (including every tenant color field) rides through via spread, so
        // adding a field to LoginResponse/AuthData can never silently drop
        // out of one side of this assignment the way a hand-written field
        // list could.
        const { token, superadmin, ...rest } = response;
        // Defensively normalize features to an array: a superadmin has no tenant
        // so the BE may legitimately send no features. Storing a guaranteed array
        // keeps the cached payload shape valid (isStaleAuthShape would otherwise
        // flag a missing `features` and force a re-login loop).
        const features = rest.features ?? [];
        setToken(token);
        setAuthData({ ...rest, features, superadmin });
        localStorageService.saveData({ ...response, features });
        // Always reset the selected-tenant keys on login: a previous superadmin
        // session in this browser may have left selectedTenantId / Slug behind,
        // which would otherwise leak into a subsequent non-superadmin session.
        localStorageService.clearSelectedTenant();
        status = true;
        // Superadmin picks a tenant first; a regular user lands on their first
        // enabled module (usually /dashboard, but e.g. /attendance if `orders`
        // is disabled for their tenant).
        navigate(
          superadmin ? '/select-tenant' : firstEnabledModuleRoute(features)
        );
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

  const value = useMemo(
    () => ({ token, authData, isLoading, login, logout }),
    [token, authData, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

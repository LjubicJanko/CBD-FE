import axios, { AxiosHeaders } from 'axios';
import localStorageService from '../services/localStorage.service';

import authBus from '../services/bus';

const API_URL = import.meta.env.VITE_API_URL;

const privateClient = axios.create({
  baseURL: `${API_URL}/api`,
});

privateClient.interceptors.request.use(
  (config) => {
    if (localStorageService.token) {
      if (!config.headers) config.headers = new AxiosHeaders();
      config.headers.set(
        'Authorization',
        `Bearer ${localStorageService.token}`
      );

      // Only superadmins impersonate via X-Tenant-Id. For regular users the BE
      // ignores the header (tenant is bound to the JWT), so gating here keeps
      // the BE's mismatch log noise-free and adds a second layer to the check.
      if (localStorageService.authData?.superadmin) {
        const selectedTenantId = localStorageService.selectedTenantId;
        if (selectedTenantId !== null) {
          config.headers.set('X-Tenant-Id', String(selectedTenantId));
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Phrases the BE sends in the 403 body that indicate the active tenant context
// is gone (deactivated / removed / never existed). On any of these — or any
// 410 (TenantInactiveException) — the FE has to drop the selection and bounce
// the user out. Pattern-matching on the message is fragile but the BE doesn't
// emit a stable error code; revisit if/when it does.
const TENANT_CONTEXT_LOST_PHRASES = [
  'Selected tenant is deactivated',
  'Selected tenant does not exist',
  'Tenant is no longer active',
];

const isTenantContextLost = (
  status: number | undefined,
  message: string | undefined
): boolean => {
  if (status === 410) return true;
  if (status !== 403 || !message) return false;
  return TENANT_CONTEXT_LOST_PHRASES.some((phrase) => message.includes(phrase));
};

privateClient.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized error
    if (error.response?.status === 498) {
      console.error('Token expired or unauthorized access');
      authBus.emit('token-expired');

      localStorageService.clearData();
    }

    const status: number | undefined = error.response?.status;
    const beMessage: string | undefined = error.response?.data?.message;

    if (status === 403 || status === 410) {
      // Surface the BE message globally so the user knows what just happened.
      // Snackbar bus mirrors the existing token-expired pattern: emit on
      // authBus, SnackbarProvider listens and calls showSnackbar.
      if (beMessage) {
        authBus.emit('snackbar', { message: beMessage, severity: 'error' });
      }

      if (isTenantContextLost(status, beMessage)) {
        const cachedAuth = localStorageService.authData;
        if (cachedAuth?.superadmin) {
          // Superadmin can recover by picking another tenant.
          const pathname = window.location.pathname;
          const onTenantlessPage =
            pathname.startsWith('/select-tenant') ||
            pathname.startsWith('/platform');
          if (!onTenantlessPage) {
            localStorageService.clearSelectedTenant();
            window.location.href = '/select-tenant';
          }
        } else {
          // Regular user's tenant died mid-session — no recovery path. Force
          // logout via the same bus event the 498 path uses.
          authBus.emit('token-expired');
          localStorageService.clearData();
        }
      }
    }

    return Promise.reject(error);
  }
);

export default privateClient;

import {
  AttendanceScanPage,
  DashboardPage,
  HomePage,
  IdTrackingPage,
  LoginPage,
  ProfilePage,
} from '../../pages';
import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import PrivateRouteWrapper from './PrivateRouteWrapper';
import { isAuthenticated } from './helpers';
import { HeaderComponent } from '../../components';
import OrdersProvider from '../OrdersProvider/Orders.provider';
import ErrorPage from './error/ErrorPage';
import ProtectedRoute from './ProtectedRoute';
import FeatureRoute from './FeatureRoute';
import SuperadminRoute from './SuperadminRoute';
import TenantContextRequired from './TenantContextRequired';
import { privileges } from '../../util/util';
import { Feature } from '../../util/features';
import OrderExtensionPage from '../../pages/order-еxtension/OrderExtension.page';
import PublicFooter from '../../components/public-footer/PublicFooter.component';
import BannerProvider from '../BannerProvider';
import AttendanceProvider from '../AttendanceProvider';
import React, { lazy, Suspense } from 'react';
import { CircularProgress } from '@mui/material';

// Lazy-loaded: gated behind a feature flag/superadmin/privilege check, so
// most sessions never need these chunks (and Reports/AttendanceHub pull in
// recharts/leaflet, which are otherwise unconditionally bundled for everyone).
const ReportsPage = lazy(() => import('../../pages/reports/Reports.page'));
const PlatformPage = lazy(() => import('../../pages/platform/Platform.page'));
const AttendanceHubPage = lazy(
  () => import('../../pages/attendance/AttendanceHub.page')
);
const SelectTenantPage = lazy(
  () => import('../../pages/select-tenant/SelectTenant.page')
);
const CreateOrderPage = lazy(
  () => import('../../pages/create-order/CreateOrder.page')
);

const RouteFallback: React.FC = () => (
  <div
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 0',
    }}
  >
    <CircularProgress />
  </div>
);

const PrivateLayout: React.FC = () => {
  return (
    <BannerProvider>
      <AttendanceProvider>
        <HeaderComponent />
        <main>
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </AttendanceProvider>
    </BannerProvider>
  );
};

const PublicLayout: React.FC = () => {
  return (
    <BannerProvider>
      <HeaderComponent />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </BannerProvider>
  );
};

const CBDRouter: React.FC = (): JSX.Element => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<PublicLayout />}>
          <Route
            index
            element={<HomePage />}
            loader={async () => await isAuthenticated()}
          />
          <Route
            path="track"
            element={<IdTrackingPage />}
            loader={async () => await isAuthenticated()}
          />
          <Route
            path="track/:tenantSlug"
            element={<IdTrackingPage />}
            loader={async () => await isAuthenticated()}
          />
          <Route
            path="track/:tenantSlug/:trackingId"
            element={<IdTrackingPage />}
            loader={async () => await isAuthenticated()}
          />
          <Route
            path="order-extension"
            element={<OrderExtensionPage />}
            loader={async () => await isAuthenticated()}
          />
          <Route
            path="order-extension/:tenantSlug"
            element={<OrderExtensionPage />}
            loader={async () => await isAuthenticated()}
          />
          {/* No isAuthenticated loader here, deliberately: unlike the other
              public routes, an already-logged-in employee is the COMMON case
              for this one (scanning at work) and must not be bounced to
              /dashboard before the scan is processed. Logged-out visitors get
              an inline login on the page itself. */}
          <Route
            path="attendance/scan/:tenantSlug/:token"
            element={<AttendanceScanPage />}
          />
          <Route
            path="login"
            element={<LoginPage />}
            loader={async () => await isAuthenticated()}
          />
          <Route
            path="login/:tenantSlug"
            element={<LoginPage />}
            loader={async () => await isAuthenticated()}
          />
          <Route
            path=":tenantSlug"
            element={<HomePage />}
            loader={async () => await isAuthenticated()}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
        <Route path="/" element={<PrivateLayout />}>
          <Route element={<PrivateRouteWrapper />} errorElement={<ErrorPage />}>
            <Route element={<SuperadminRoute />}>
              <Route path="select-tenant" element={<SelectTenantPage />} />
              <Route path="platform" element={<PlatformPage />} />
            </Route>
            <Route element={<TenantContextRequired />}>
              {/* `orders` module: dashboard + order creation + payments. */}
              <Route
                element={<FeatureRoute requiredFeature={Feature.ORDERS} />}
              >
                <Route
                  path="dashboard"
                  element={
                    <OrdersProvider>
                      <DashboardPage />
                    </OrdersProvider>
                  }
                />
                <Route
                  element={
                    <ProtectedRoute
                      requiredPrivilege={privileges.ORDER_CREATE}
                    />
                  }
                >
                  <Route path="createOrder" element={<CreateOrderPage />} />
                </Route>
              </Route>
              {/* Profile is always reachable, it is the landing fallback when a
                  tenant has no other module enabled. */}
              <Route path="profile" element={<ProfilePage />} />
              {/* `reports` is feature-gated only (no per-user privilege today). */}
              <Route
                element={<FeatureRoute requiredFeature={Feature.REPORTS} />}
              >
                <Route path="reports" element={<ReportsPage />} />
              </Route>
              {/* `attendance` module: attendance, attendance overview and
                  locations are tabs of a single page; the hub self-gates each
                  tab by privilege. */}
              <Route
                element={<FeatureRoute requiredFeature={Feature.ATTENDANCE} />}
              >
                <Route path="attendance" element={<AttendanceHubPage />} />
                <Route
                  path="attendance-admin"
                  element={<Navigate to="/attendance" replace />}
                />
                <Route
                  path="locations"
                  element={<Navigate to="/attendance" replace />}
                />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default CBDRouter;

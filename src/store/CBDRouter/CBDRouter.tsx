import {
  DashboardPage,
  HomePage,
  IdTrackingPage,
  LoginPage,
  ProfilePage,
  ReportsPage,
  SelectTenantPage,
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
import CreateOrderPage from '../../pages/create-order/CreateOrder.page';
import ErrorPage from './error/ErrorPage';
import ProtectedRoute from './ProtectedRoute';
import SuperadminRoute from './SuperadminRoute';
import TenantContextRequired from './TenantContextRequired';
import { privileges } from '../../util/util';
import OrderExtensionPage from '../../pages/order-еxtension/OrderExtension.page';
import PublicFooter from '../../components/public-footer/PublicFooter.component';
import PlatformPage from '../../pages/platform/Platform.page';
import BannerProvider from '../BannerProvider';
import React from 'react';

const PrivateLayout: React.FC = () => {
  return (
    <BannerProvider>
      <HeaderComponent />
      <main>
        <Outlet />
      </main>
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
          <Route
            path="login"
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
              <Route path="profile" element={<ProfilePage />} />
              <Route path="reports" element={<ReportsPage />} />
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

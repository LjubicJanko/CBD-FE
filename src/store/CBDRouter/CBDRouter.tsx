import { DashboardPage, ProfilePage } from '../../pages';
import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import PrivateRouteWrapper from './PrivateRouteWrapper';
import { HeaderComponent } from '../../components';
import CreateOrderPage from '../../pages/create-order/CreateOrder.page';
import ErrorPage from './error/ErrorPage';
import ProtectedRoute from './ProtectedRoute';
import { privileges } from '../../util/util';
import CompaniesPage from '../../pages/companies/Companies.page';
import CompanyPage from '../../pages/company/Company.page';
import CompanyProvider from '../CompanyProvider/Company.provider';
import CompanyInfoPage from '../../pages/company-config/CompanyConfig.page';
import OrdersPage from '../../pages/orders/Orders.page';
import OrdersProvider from '../OrdersProvider/Orders.provider';
import { ConfigPage } from '../../pages/config/Config.page';

const PrivateLayout: React.FC = () => {
  return (
    <>
      <HeaderComponent />
      <main>
        <Outlet />
      </main>
    </>
  );
};

const CBDRouter: React.FC = (): JSX.Element => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route element={<PrivateRouteWrapper />} errorElement={<ErrorPage />}>
          <Route path="companies-overview" element={<CompaniesPage />} />
          <Route
            path="company/:id"
            element={
              <CompanyProvider>
                <CompanyPage />
              </CompanyProvider>
            }
          >
            <Route index element={<Navigate to="orders" replace />} />
            <Route path="config" element={<CompanyInfoPage />} />
            <Route path="orders" element={<OrdersPage />} />
          </Route>
          <Route
            element={
              <ProtectedRoute requiredPrivilege={privileges.ORDER_CREATE} />
            }
          >
            <Route path="createOrder" element={<CreateOrderPage />} />
          </Route>
          <Route
            element={
              <ProtectedRoute requiredPrivilege={privileges.SUPER_PERMISSION} />
            }
          >
            <Route path="config" element={<ConfigPage />} />
          </Route>
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="/" element={<PrivateLayout />}>
          <Route element={<PrivateRouteWrapper />} errorElement={<ErrorPage />}>
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
                <ProtectedRoute requiredPrivilege={privileges.ORDER_CREATE} />
              }
            >
              <Route path="createOrder" element={<CreateOrderPage />} />
            </Route>
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default CBDRouter;

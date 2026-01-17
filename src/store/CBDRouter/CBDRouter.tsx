import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { HeaderComponent } from '../../components';
import { HomePage, IdTrackingPage, LoginPage, ProfilePage } from '../../pages';
import CompaniesPage from '../../pages/companies/Companies.page';
import CompanyInfoPage from '../../pages/company-config/CompanyConfig.page';
import CompanyPage from '../../pages/company/Company.page';
import { ConfigPage } from '../../pages/config/Config.page';
import CreateOrderPage from '../../pages/create-order/CreateOrder.page';
import OrdersPage from '../../pages/orders/Orders.page';
import { privileges } from '../../util/util';
import CompanyProvider from '../CompanyProvider/Company.provider';
import ErrorPage from './error/ErrorPage';
import PrivateRouteWrapper from './PrivateRouteWrapper';
import ProtectedRoute from './ProtectedRoute';
import OrderExtensionPage from '../../pages/order-еxtension/OrderExtension.page';
import { isAuthenticated } from './helpers';
import PublicFooter from '../../components/public-footer/PublicFooter.component';


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

const PublicLayout: React.FC = () => {
  return (
    <>
      <HeaderComponent />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
};

const CBDRouter: React.FC = (): JSX.Element => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public routes */}
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
            path="order-extension"
            element={<OrderExtensionPage />}
            loader={async () => await isAuthenticated()}
          />
          <Route
            path="login"
            element={<LoginPage />}
            loader={async () => await isAuthenticated()}
          />
        </Route>

        {/* Private routes */}
        <Route element={<PrivateLayout />}>
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
              <Route
                element={
                  <ProtectedRoute requiredPrivilege={privileges.ORDER_CREATE} />
                }
              >
                <Route path="createOrder" element={<CreateOrderPage />} />
              </Route>
            </Route>
            <Route
              element={
                <ProtectedRoute
                  requiredPrivilege={privileges.SUPER_PERMISSION}
                />
              }
            >
              <Route path="config" element={<ConfigPage />} />
            </Route>
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default CBDRouter;

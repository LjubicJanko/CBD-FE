import {
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
import CreateOrderPage from '../../pages/create-order/CreateOrder.page';
import ErrorPage from './error/ErrorPage';
import ProtectedRoute from './ProtectedRoute';
import { privileges } from '../../util/util';

const Layout: React.FC = () => {
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
          path="login"
          element={<LoginPage />}
          loader={async () => await isAuthenticated()}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default CBDRouter;

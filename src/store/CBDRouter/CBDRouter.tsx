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
// type Route = {
//   path: string;
//   component: React.FC | any;
//   title: string;
// };

// const routes: Route[] = [
//   {
//     path: "/",
//     title: "Landing page",
//     component: DecisionComponent,
//   },
//   {
//     path: "/home",
//     title: "Home page",
//     component: HomeComponent,
//   },
//   {
//     path: "/login",
//     component: LoginComponent,
//     title: "Log in",
//   },
//   {
//     path: "/dashboard",
//     component: DashboardComponent,
//     title: "Dashboard",
//   },
// ];

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
  // return <Router history={history}>{renderRoutes(routes)}</Router>;
  // return (
  //   <Router history={historyConfig}>
  //     <HeaderComponent />
  //     <Switch>
  //       <Route exact path="/" component={DecisionPage} />
  //       {/* <PublicRouteWrapper> */}
  //       <Route path="/home" component={HomePage} />
  //       {/* </PublicRouteWrapper> */}
  //       <Route path="/login" component={LoginPage} />
  //       {/* <PublicRouteWrapper> */}
  //       <Route path="/signup" component={SignUpPage} />
  //       {/* </PublicRouteWrapper> */}
  //       {/* <PrivateRouteWrapper> */}
  //       <Route path="/dashboard" component={DashboardPage} />
  //       {/* </PrivateRouteWrapper> */}
  //     </Switch>
  //   </Router>
  // );

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

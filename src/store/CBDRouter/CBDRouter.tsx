import {
  DashboardPage,
  // DecisionPage,
  HomePage,
  LoginPage,
  SignUpPage,
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
      <HeaderComponent /> {/* Always visible */}
      <main>
        <Outlet /> {/* Render the routed component here */}
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
        <Route element={<PrivateRouteWrapper />}>
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
        <Route
          index
          element={<HomePage />}
          loader={async () => await isAuthenticated()}
        />
        <Route
          path="login"
          element={<LoginPage />}
          loader={async () => await isAuthenticated()}
        />
        <Route
          path="signup"
          element={<SignUpPage />}
          loader={async () => await isAuthenticated()}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default CBDRouter;

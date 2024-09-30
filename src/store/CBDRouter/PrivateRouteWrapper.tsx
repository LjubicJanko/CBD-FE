import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../AuthProvider/Auth.context';

const PrivateRouteWrapper = () => {
  // const PrivateRouteWrapper = ({ children }: PropsWithChildren) => {
  const { token } = useContext(AuthContext);

  // return token ? <>{children}</> : <Redirect to={'/'} />;
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRouteWrapper;

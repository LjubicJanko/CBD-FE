import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../AuthProvider/Auth.context';

export type ProtectedRouteProps = {
  requiredPrivilege: string;
};

const ProtectedRoute = ({ requiredPrivilege }: ProtectedRouteProps) => {
  const { authData } = useContext(AuthContext);

  // Check if the user has the required privilege
  const hasPrivilege = authData?.privileges?.includes(requiredPrivilege);

  // If the user doesn't have the privilege, redirect them
  return hasPrivilege ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default ProtectedRoute;

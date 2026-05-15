import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../AuthProvider/Auth.context';

const SuperadminRoute = () => {
    const { authData } = useContext(AuthContext);

    return authData?.superadmin ? (
        <Outlet />
    ) : (
        <Navigate to="/dashboard" replace />
    );
};

export default SuperadminRoute;

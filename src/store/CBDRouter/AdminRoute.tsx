import { Navigate, Outlet } from 'react-router-dom';
import { useIsCompanyAdmin } from '../../hooks/useRole';

// Company admin (or a superadmin with a tenant selected, see useIsCompanyAdmin).
// Non-admins fall back to the Reports page they can already open.
const AdminRoute = () => {
    const isAdmin = useIsCompanyAdmin();

    return isAdmin ? <Outlet /> : <Navigate to="/reports" replace />;
};

export default AdminRoute;

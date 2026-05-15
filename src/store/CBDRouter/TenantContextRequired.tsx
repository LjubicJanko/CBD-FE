import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../AuthProvider/Auth.context';
import localStorageService from '../../services/localStorage.service';

const TenantContextRequired = () => {
    const { authData } = useContext(AuthContext);

    // Reads localStorage synchronously each render rather than reactively.
    // That's fine here: tenant switches in this app always trigger a hard
    // navigation (window.location.href = '/dashboard'), so the guard
    // re-evaluates on the next mount. If a future change introduces SPA-style
    // tenant switching, lift selectedTenantId/Slug into a context first.
    if (authData?.superadmin && localStorageService.selectedTenantId === null) {
        return <Navigate to="/select-tenant" replace />;
    }

    return <Outlet />;
};

export default TenantContextRequired;

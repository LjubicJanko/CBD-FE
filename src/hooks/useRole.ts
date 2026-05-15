import { useContext } from 'react';
import AuthContext from '../store/AuthProvider/Auth.context';

// Centralizes the BE quirk that a superadmin user is returned with
// roles: ['company_admin'] so that privilege gates fire. To distinguish a
// "true superadmin" from a regular company admin, always go through
// useIsSuperadmin (never check the role).
export const useIsCompanyAdmin = (): boolean => {
    const { authData } = useContext(AuthContext);
    return authData?.roles?.includes('company_admin') ?? false;
};

export const useIsSuperadmin = (): boolean => {
    const { authData } = useContext(AuthContext);
    return Boolean(authData?.superadmin);
};

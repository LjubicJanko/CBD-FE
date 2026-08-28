import {
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useParams } from 'react-router-dom';
import BannerContext, { BannerContextType } from './Banner.context';
import { Banner, BannerLocation } from '../../types/Banner';
import { bannerService } from '../../api';
import AuthContext from '../AuthProvider/Auth.context';
import localStorageService from '../../services/localStorage.service';

const BannerProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [activeBanner, setActiveBanner] = useState<Banner | null>(null);
    const [dismissed, setDismissed] = useState<Record<BannerLocation, boolean>>(
        { HOME: false, ID_TRACKING: false, ORDER: false }
    );

    const { tenantSlug: urlSlug } = useParams<{ tenantSlug?: string }>();
    const { authData } = useContext(AuthContext);
    const envSlug = import.meta.env.VITE_TENANT_SLUG as string | undefined;

    // For superadmin, the active tenant is the one they switched into (kept in
    // localStorage by the header / select-tenant flow). authData.tenantSlug is
    // their own home tenant, which is NOT what they're acting on.
    //
    // Reads localStorage synchronously rather than reactively. That's fine
    // here: tenant switches in this app always trigger a hard navigation
    // (window.location.href = '/dashboard'), so this provider remounts on the
    // next page and re-reads the storage. If a future change introduces
    // SPA-style tenant switching, lift selectedTenantSlug into a context
    // first, otherwise banners will desync.
    // Same constraint applies in Header.component and TenantContextRequired.
    const authSlug = authData?.superadmin
        ? localStorageService.selectedTenantSlug
        : authData?.tenantSlug;

    const resolvedSlug = urlSlug || authSlug || envSlug || null;

    const dismissBanner = useCallback((page: BannerLocation) => {
        setDismissed((prev) => ({ ...prev, [page]: true }));
    }, []);

    useEffect(() => {
        if (!resolvedSlug) {
            setActiveBanner(null);
            return;
        }
        bannerService
            .getActive(resolvedSlug)
            .then((data: Banner | null) => setActiveBanner(data))
            .catch((error) => {
                console.error('Failed to fetch banners:', error);
                setActiveBanner(null);
            });
    }, [resolvedSlug]);

    const contextValue: BannerContextType = {
        activeBanner,
        dismissed,
        dismissBanner,
    };

    return (
        <BannerContext.Provider value={contextValue}>
            {children}
        </BannerContext.Provider>
    );
};

export default BannerProvider;

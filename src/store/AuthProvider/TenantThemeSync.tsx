import { useContext, useEffect, useSyncExternalStore } from 'react';
import AuthContext from './Auth.context';
import { restoreBaselineTheme } from '../../styles/applyTenantTheme';
import { selectedTenantFeaturesStore } from '../../services/selectedTenantFeatures.store';
import { selectedTenantThemeStore } from '../../services/selectedTenantTheme.store';

/**
 * Applies the session's tenant theme (accent + background) reactively. Renders
 * nothing. The actual resolution lives in `resolveBaselineColors`:
 *  - regular user: their own tenant's colors from auth state;
 *  - superadmin: the impersonated tenant's colors (from the selected-tenant
 *    stores), so the whole platform session is themed to the tenant being
 *    managed and re-themes the moment colors are picked/saved — no reload.
 * In all cases the theme is applied only when the active tenant has the
 * `theming` feature; otherwise the `:root` defaults take over. Public
 * (logged-out) pages theme themselves by slug via `useApplyTenantTheme`.
 */
const TenantThemeSync = (): null => {
    const { authData } = useContext(AuthContext);

    // Subscribe to the superadmin's selected-tenant theme + features so a
    // pick/save re-runs the effect. Snapshots are cached references (stable
    // until notify()), keeping these deps quiet for a regular user.
    const selectedTheme = useSyncExternalStore(
        selectedTenantThemeStore.subscribe,
        selectedTenantThemeStore.getSnapshot
    );
    const selectedFeatures = useSyncExternalStore(
        selectedTenantFeaturesStore.subscribe,
        selectedTenantFeaturesStore.getSnapshot
    );

    useEffect(() => {
        restoreBaselineTheme();
    }, [
        authData?.superadmin,
        authData?.features,
        authData?.tenantAccentColor,
        authData?.tenantBackgroundColor,
        selectedTheme,
        selectedFeatures,
    ]);

    return null;
};

export default TenantThemeSync;

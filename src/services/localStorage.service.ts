import { AuthData } from '../types/Auth';
import { BannerLocation } from '../types/Banner';
import { selectedTenantFeaturesStore } from './selectedTenantFeatures.store';
import { selectedTenantThemeStore } from './selectedTenantTheme.store';

export default {
    saveData(data: AuthData): void {
        const { token, ...rest } = data;

        localStorage.setItem('token', token);
        localStorage.setItem('authData', JSON.stringify(rest));
    },
    clearData(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('authData');
        localStorage.removeItem('selectedTenantId');
        localStorage.removeItem('selectedTenantSlug');
        localStorage.removeItem('selectedTenantFeatures');
        localStorage.removeItem(selectedTenantThemeStore.ACCENT_KEY);
        localStorage.removeItem(selectedTenantThemeStore.BACKGROUND_KEY);
        selectedTenantFeaturesStore.notify();
        selectedTenantThemeStore.notify();
    },
    get token(): string | null {
        return localStorage.getItem('token');
    },
    get authData(): Omit<AuthData, 'token'> | null {
        const data = localStorage.getItem('authData');
        return JSON.parse(data || 'null');
    },

    setSelectedTenant(
        tenantId: number | null,
        tenantSlug: string | null = null,
        // The selected tenant's enabled feature keys. Superadmin has no tenant
        // of their own, so the impersonated tenant's features are cached here
        // and exposed reactively via selectedTenantFeaturesStore (so a feature
        // toggle in /profile re-renders the menu/guards without a refresh).
        features: string[] | null = null,
        // The impersonated tenant's brand colors, cached + exposed reactively
        // via selectedTenantThemeStore so a superadmin's session is themed to
        // the selected tenant (and re-themes on save without a reload).
        colors: { accentColor: string | null; backgroundColor: string | null } | null = null
    ): void {
        if (tenantId === null) {
            localStorage.removeItem('selectedTenantId');
            localStorage.removeItem('selectedTenantSlug');
            localStorage.removeItem('selectedTenantFeatures');
            localStorage.removeItem(selectedTenantThemeStore.ACCENT_KEY);
            localStorage.removeItem(selectedTenantThemeStore.BACKGROUND_KEY);
            selectedTenantFeaturesStore.notify();
            selectedTenantThemeStore.notify();
            return;
        }
        localStorage.setItem('selectedTenantId', String(tenantId));
        if (tenantSlug) {
            localStorage.setItem('selectedTenantSlug', tenantSlug);
        } else {
            localStorage.removeItem('selectedTenantSlug');
        }
        if (features) {
            localStorage.setItem(
                'selectedTenantFeatures',
                JSON.stringify(features)
            );
        } else {
            localStorage.removeItem('selectedTenantFeatures');
        }
        if (colors?.accentColor) {
            localStorage.setItem(
                selectedTenantThemeStore.ACCENT_KEY,
                colors.accentColor
            );
        } else {
            localStorage.removeItem(selectedTenantThemeStore.ACCENT_KEY);
        }
        if (colors?.backgroundColor) {
            localStorage.setItem(
                selectedTenantThemeStore.BACKGROUND_KEY,
                colors.backgroundColor
            );
        } else {
            localStorage.removeItem(selectedTenantThemeStore.BACKGROUND_KEY);
        }
        selectedTenantFeaturesStore.notify();
        selectedTenantThemeStore.notify();
    },
    clearSelectedTenant(): void {
        localStorage.removeItem('selectedTenantId');
        localStorage.removeItem('selectedTenantSlug');
        localStorage.removeItem('selectedTenantFeatures');
        localStorage.removeItem(selectedTenantThemeStore.ACCENT_KEY);
        localStorage.removeItem(selectedTenantThemeStore.BACKGROUND_KEY);
        selectedTenantFeaturesStore.notify();
        selectedTenantThemeStore.notify();
    },
    /**
     * After a superadmin edits a tenant, refresh the cached selection IF that
     * tenant is the one currently being impersonated, so slug/feature changes
     * take effect immediately (the reactive store notifies subscribers) without
     * a re-select. No-op for any other tenant. Single home for this invariant,
     * shared by the platform detail page and the /profile Premium tab.
     */
    recacheSelectedTenant(tenant: {
        id: number;
        slug: string;
        features: string[];
        accentColor?: string | null;
        backgroundColor?: string | null;
    }): void {
        if (this.selectedTenantId !== tenant.id) return;
        this.setSelectedTenant(tenant.id, tenant.slug, tenant.features, {
            accentColor: tenant.accentColor ?? null,
            backgroundColor: tenant.backgroundColor ?? null,
        });
    },
    get selectedTenantId(): number | null {
        const val = localStorage.getItem('selectedTenantId');
        return val !== null ? Number(val) : null;
    },
    get selectedTenantSlug(): string | null {
        return localStorage.getItem('selectedTenantSlug');
    },
    // Selected-tenant features are consumed reactively through
    // selectedTenantFeaturesStore (which owns the parse); no direct getter here.

    setBannerDismissed(page: BannerLocation, value: boolean) {
        localStorage.setItem(`bannerDismissed_${page}`, JSON.stringify(value));
    },

    getBannerDismissed(page: BannerLocation): boolean {
        return JSON.parse(
            localStorage.getItem(`bannerDismissed_${page}`) || 'false'
        );
    },
};

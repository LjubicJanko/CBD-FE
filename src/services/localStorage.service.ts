import { AuthData } from '../types/Auth';
import { BannerLocation } from '../types/Banner';

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
        tenantSlug: string | null = null
    ): void {
        if (tenantId === null) {
            localStorage.removeItem('selectedTenantId');
            localStorage.removeItem('selectedTenantSlug');
            return;
        }
        localStorage.setItem('selectedTenantId', String(tenantId));
        if (tenantSlug) {
            localStorage.setItem('selectedTenantSlug', tenantSlug);
        } else {
            localStorage.removeItem('selectedTenantSlug');
        }
    },
    clearSelectedTenant(): void {
        localStorage.removeItem('selectedTenantId');
        localStorage.removeItem('selectedTenantSlug');
    },
    get selectedTenantId(): number | null {
        const val = localStorage.getItem('selectedTenantId');
        return val !== null ? Number(val) : null;
    },
    get selectedTenantSlug(): string | null {
        return localStorage.getItem('selectedTenantSlug');
    },

    setBannerDismissed(page: BannerLocation, value: boolean) {
        localStorage.setItem(`bannerDismissed_${page}`, JSON.stringify(value));
    },

    getBannerDismissed(page: BannerLocation): boolean {
        return JSON.parse(
            localStorage.getItem(`bannerDismissed_${page}`) || 'false'
        );
    },
};

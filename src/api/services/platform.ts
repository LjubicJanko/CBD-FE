import privateClient from '../privateClient';

export type SocialLinkType = 'INSTAGRAM' | 'FACEBOOK' | 'WEBSITE';

export type SocialLink = {
    type: SocialLinkType;
    url: string;
    displayText: string;
};

export type Tenant = {
    id: number;
    name: string;
    slug: string;
    logoUrl: string | null;
    active: boolean;
    socialLink: SocialLink | null;
};

export type CreateTenantData = {
    name: string;
    slug: string;
    // Optional in the payload: omit to leave unchanged, `null` to clear,
    // an object to set/replace (BE null-vs-omitted semantics).
    socialLink?: SocialLink | null;
};

const getTenants = async (): Promise<Tenant[]> =>
    privateClient.get('/platform/tenants').then((res) => res.data);

const getTenant = async (id: number): Promise<Tenant> =>
    privateClient.get(`/platform/tenants/${id}`).then((res) => res.data);

const createTenant = async (data: CreateTenantData): Promise<Tenant> =>
    privateClient.post('/platform/tenants', data).then((res) => res.data);

const updateTenant = async (
    id: number,
    data: CreateTenantData
): Promise<Tenant> =>
    privateClient.put(`/platform/tenants/${id}`, data).then((res) => res.data);

const deleteTenant = async (id: number): Promise<void> =>
    privateClient.delete(`/platform/tenants/${id}`).then((res) => res.data);

const uploadTenantLogo = async (id: number, file: File): Promise<Tenant> => {
    const formData = new FormData();
    formData.append('logo', file);
    return privateClient
        .post(`/platform/tenants/${id}/logo`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => res.data);
};

const deleteTenantLogo = async (id: number): Promise<void> =>
    privateClient
        .delete(`/platform/tenants/${id}/logo`)
        .then((res) => res.data);

export const getLogoAbsoluteUrl = (
    relativePath: string | null | undefined,
    cacheBust?: string | number
): string | null => {
    if (!relativePath) return null;
    if (/^https?:\/\//.test(relativePath)) {
        return cacheBust ? `${relativePath}?v=${cacheBust}` : relativePath;
    }
    const base = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
    const path = relativePath.startsWith('/')
        ? relativePath
        : `/${relativePath}`;
    const url = `${base}${path}`;
    return cacheBust ? `${url}?v=${cacheBust}` : url;
};

export default {
    getTenants,
    getTenant,
    createTenant,
    updateTenant,
    deleteTenant,
    uploadTenantLogo,
    deleteTenantLogo,
};

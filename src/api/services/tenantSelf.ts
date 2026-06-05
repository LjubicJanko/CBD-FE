import privateClient from '../privateClient';
import { SocialLink, Tenant } from './platform';

// JWT-scoped, no-id-in-path self-service endpoints (ProfileController). A
// company_admin manages ONLY their own tenant — name, logo and social link.
// Slug and active are not editable here (the BE doesn't accept them).

export type UpdateOwnTenantData = {
    name: string;
    // Same null-vs-omitted semantics as the platform update: object = set,
    // null = clear, omitted = unchanged.
    socialLink?: SocialLink | null;
};

const getMyTenant = async (): Promise<Tenant> =>
    privateClient.get('/profile/tenant').then((res) => res.data);

const updateMyTenant = async (data: UpdateOwnTenantData): Promise<Tenant> =>
    privateClient.put('/profile/tenant', data).then((res) => res.data);

const uploadMyLogo = async (file: File): Promise<Tenant> => {
    const formData = new FormData();
    formData.append('logo', file);
    return privateClient
        .post('/profile/tenant/logo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => res.data);
};

const deleteMyLogo = async (): Promise<void> =>
    privateClient.delete('/profile/tenant/logo').then((res) => res.data);

export default {
    getMyTenant,
    updateMyTenant,
    uploadMyLogo,
    deleteMyLogo,
};

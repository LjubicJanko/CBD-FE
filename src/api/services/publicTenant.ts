import client from '../client';

export type PublicTenant = {
    name: string;
    slug: string;
    logoUrl: string | null;
};

const getTenantBySlug = async (slug: string): Promise<PublicTenant> =>
    client.get(`/public/tenants/${slug}`).then((res) => res.data);

export default {
    getTenantBySlug,
};

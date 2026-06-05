import client from '../client';
import { SocialLink } from './platform';

export type PublicTenant = {
    name: string;
    slug: string;
    logoUrl: string | null;
    socialLink: SocialLink | null;
};

const getTenantBySlug = async (slug: string): Promise<PublicTenant> =>
    client.get(`/public/tenants/${slug}`).then((res) => res.data);

export default {
    getTenantBySlug,
};

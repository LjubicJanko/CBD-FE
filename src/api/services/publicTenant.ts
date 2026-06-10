import client from '../client';
import { SocialLink } from './platform';

export type PublicTenant = {
    name: string;
    slug: string;
    logoUrl: string | null;
    socialLink: SocialLink | null;
    // Enabled feature keys (see src/util/features.ts); used to gate the public
    // order-extension page and to decide whether to apply the tenant's theme.
    features: string[];
    // Per-tenant brand colors (6-digit hex), null when unset. Applied on the
    // public pages only when `features` includes 'theming'.
    accentColor: string | null;
    backgroundColor: string | null;
};

const getTenantBySlug = async (slug: string): Promise<PublicTenant> =>
    client.get(`/public/tenants/${slug}`).then((res) => res.data);

export default {
    getTenantBySlug,
};

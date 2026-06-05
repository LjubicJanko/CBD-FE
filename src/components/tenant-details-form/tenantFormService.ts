import { platformService, tenantSelfService } from '../../api';
import { SocialLink, Tenant } from '../../api/services/platform';

/**
 * The three write operations the shared TenantDetailsForm performs, decoupled
 * from the concrete endpoint. This is what keeps the form endpoint-agnostic:
 *  - superadmin acts on any tenant through the platform endpoints (id in path,
 *    slug editable) -> `platformTenantFormService`.
 *  - a client admin acts on their OWN tenant through the JWT-scoped self-service
 *    endpoints (no id, no slug) -> `selfTenantFormService`.
 */
export type TenantFormService = {
    update: (data: {
        name: string;
        slug?: string;
        socialLink: SocialLink | null;
    }) => Promise<Tenant>;
    uploadLogo: (file: File) => Promise<Tenant>;
    removeLogo: () => Promise<void>;
};

export const platformTenantFormService = (id: number): TenantFormService => ({
    // Superadmin always edits the slug, so it is always present here.
    update: ({ name, slug, socialLink }) =>
        platformService.updateTenant(id, { name, slug: slug ?? '', socialLink }),
    uploadLogo: (file) => platformService.uploadTenantLogo(id, file),
    removeLogo: () => platformService.deleteTenantLogo(id),
});

export const selfTenantFormService: TenantFormService = {
    // Self-service ignores slug; only name + socialLink are sent.
    update: ({ name, socialLink }) =>
        tenantSelfService.updateMyTenant({ name, socialLink }),
    uploadLogo: (file) => tenantSelfService.uploadMyLogo(file),
    removeLogo: () => tenantSelfService.deleteMyLogo(),
};

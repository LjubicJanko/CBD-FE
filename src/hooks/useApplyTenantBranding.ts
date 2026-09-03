import { useEffect } from 'react';
import { PublicTenant } from '../api/services/publicTenant';
import { getLogoAbsoluteUrl } from '../api/services/platform';

// Every same-rel icon link is pointed at the one tenant logo (no per-size
// icon set to offer), so an OS picking among them by declared size can never
// fall back to a leftover CBD icon.
const ICON_SELECTOR = 'link[rel="icon"], link[rel="apple-touch-icon"]';

// Sibling to useApplyTenantTheme: same `theming` gate, same restore-on-unmount shape.
export const useApplyTenantBranding = (
    tenant: PublicTenant | null,
    tenantSlug: string | undefined,
    enabled: boolean
): void => {
    const name = enabled ? tenant?.name ?? null : null;
    const logoPath = enabled ? tenant?.logoUrl ?? null : null;
    const slug = enabled ? tenantSlug ?? null : null;

    useEffect(() => {
        if (!name || !slug) return;

        const originalTitle = document.title;
        const manifestLink = document.querySelector<HTMLLinkElement>(
            'link[rel="manifest"]'
        );
        const originalManifestHref = manifestLink?.getAttribute('href') ?? null;
        const iconLinks = Array.from(
            document.querySelectorAll<HTMLLinkElement>(ICON_SELECTOR)
        );
        const originalIconHrefs = iconLinks.map(
            (el) => el.getAttribute('href') ?? ''
        );

        document.title = name;
        manifestLink?.setAttribute('href', `/api/manifest/${slug}`);

        const logoUrl = getLogoAbsoluteUrl(logoPath);
        if (logoUrl) {
            iconLinks.forEach((el) => el.setAttribute('href', logoUrl));
        }

        return () => {
            document.title = originalTitle;
            if (manifestLink && originalManifestHref !== null) {
                manifestLink.setAttribute('href', originalManifestHref);
            }
            iconLinks.forEach((el, i) =>
                el.setAttribute('href', originalIconHrefs[i])
            );
        };
    }, [name, logoPath, slug]);
};

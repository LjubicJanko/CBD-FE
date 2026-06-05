import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicTenantService } from '../../api';
import { SocialLink } from '../../api/services/platform';
import { isReservedSlug } from '../../util/reservedSlugs';
import SocialLinkButton from '../social-link/SocialLinkButton.component';
import * as Styled from './PublicFooter.styles';

const PublicFooter = () => {
    // Resolve the current public tenant the same way the public pages do:
    // route param first, then the single-tenant env default.
    const { tenantSlug } = useParams<{ tenantSlug?: string }>();
    const envSlug = import.meta.env.VITE_TENANT_SLUG as string | undefined;
    const slug = tenantSlug || envSlug;

    const [socialLink, setSocialLink] = useState<SocialLink | null>(null);

    useEffect(() => {
        if (!slug || isReservedSlug(slug)) {
            setSocialLink(null);
            return;
        }
        let cancelled = false;
        publicTenantService
            .getTenantBySlug(slug)
            .then((tenant) => {
                if (!cancelled) setSocialLink(tenant.socialLink ?? null);
            })
            .catch(() => {
                if (!cancelled) setSocialLink(null);
            });
        return () => {
            cancelled = true;
        };
    }, [slug]);

    if (!socialLink) return null;

    return (
        <Styled.PublicFooterContainer>
            <SocialLinkButton socialLink={socialLink} />
        </Styled.PublicFooterContainer>
    );
};

export default PublicFooter;

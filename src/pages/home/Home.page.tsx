import { Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Section from '../../components/section/Section.component';
import * as Styled from './Home.styles';
import PageBanner from '../../components/page-banner/PageBanner.component';
import NoContent from '../../components/no-content/NoContent.component';
import { publicTenantService } from '../../api';
import { getLogoAbsoluteUrl } from '../../api/services/platform';
import { PublicTenant } from '../../api/services/publicTenant';
import { isReservedSlug } from '../../util/reservedSlugs';
import { Feature } from '../../util/features';
import { useApplyTenantTheme } from '../../hooks/useApplyTenantTheme';

const HomeComponent = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { tenantSlug } = useParams<{ tenantSlug?: string }>();
    const envSlug = import.meta.env.VITE_TENANT_SLUG as string | undefined;

    const [loading, setLoading] = useState<boolean>(Boolean(tenantSlug));
    const [notFound, setNotFound] = useState<boolean>(false);
    const [tenant, setTenant] = useState<PublicTenant | null>(null);

    useEffect(() => {
        if (!tenantSlug) {
            setLoading(false);
            setNotFound(false);
            return;
        }
        // Defensive: the /:tenantSlug catch-all matches anything. Don't fire
        // a doomed lookup for /<reserved>, render the not-found state.
        if (isReservedSlug(tenantSlug)) {
            setLoading(false);
            setNotFound(true);
            return;
        }
        setLoading(true);
        setNotFound(false);
        publicTenantService
            .getTenantBySlug(tenantSlug)
            .then((data) => setTenant(data))
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [tenantSlug]);

    // Brand the public page in the tenant's colors when they have the `theming`
    // feature; otherwise the default palette is used.
    useApplyTenantTheme(
        {
            accentColor: tenant?.accentColor,
            backgroundColor: tenant?.backgroundColor,
            textColor: tenant?.textColor,
            mutedTextColor: tenant?.mutedTextColor,
            subtleTextColor: tenant?.subtleTextColor,
        },
        Boolean(tenant?.features?.includes(Feature.THEMING))
    );

    // Only surface the order-extension entry point when the tenant has the
    // `order-extension` feature enabled (matches the page-level guard).
    const showOrderExtension = Boolean(
        tenantSlug && tenant?.features?.includes(Feature.ORDER_EXTENSION)
    );

    // ID tracking looks up an order by its tracking id. Trackable ids come from
    // EITHER module, regular orders (`orders`) or public order requests
    // (`order-extension`), so show it when either is enabled, and hide it for a
    // tenant that has neither (e.g. an attendance-only customer). The legacy
    // no-slug home has no tenant context to gate on, so it's left untouched.
    const showIdTracking =
        !tenantSlug ||
        Boolean(
            tenant?.features?.includes(Feature.ORDERS) ||
                tenant?.features?.includes(Feature.ORDER_EXTENSION)
        );

    // A tenant with no public-facing modules (e.g. attendance-only) has no
    // customer entry points; show a branded login prompt instead of an empty
    // page so staff can still get in and the page reads as intentional.
    const showSections = showOrderExtension || showIdTracking;
    const tenantLogo = getLogoAbsoluteUrl(tenant?.logoUrl);

    if (!tenantSlug && envSlug) {
        return <Navigate to={`/${envSlug}`} replace />;
    }

    if (loading) {
        return (
            <Styled.HomeContainer className="home home--loading">
                <CircularProgress />
            </Styled.HomeContainer>
        );
    }

    if (tenantSlug && notFound) {
        return (
            <Styled.HomeContainer className="home">
                <NoContent message={t('home.tenantNotFound')} />
            </Styled.HomeContainer>
        );
    }

    return (
        <Styled.HomeContainer className="home">
            <PageBanner page="HOME" />
            {showSections ? (
                <div className="home__sections">
                    {showOrderExtension && (
                        <Section
                            title={t('order-jersey-cta')}
                            to={`/order-extension/${tenantSlug}`}
                            panelClassName="home__sections__order-panel"
                        />
                    )}
                    {showIdTracking && (
                        <Section
                            title={t('id-tracking')}
                            to={tenantSlug ? `/track/${tenantSlug}` : '/track'}
                            panelClassName="home__sections__tracking-panel"
                        />
                    )}
                </div>
            ) : (
                <div className="home__landing">
                    {tenantLogo && (
                        <img
                            className="home__landing__logo"
                            src={tenantLogo}
                            alt={tenant?.name ?? ''}
                        />
                    )}
                    {tenant?.name && (
                        <h1 className="home__landing__name">{tenant.name}</h1>
                    )}
                    <p className="home__landing__subtitle">
                        {t('home.loginPrompt')}
                    </p>
                    <Button
                        variant="contained"
                        className="home__landing__login"
                        onClick={() =>
                            navigate(
                                tenantSlug ? `/login/${tenantSlug}` : '/login'
                            )
                        }
                    >
                        {t('login')}
                    </Button>
                </div>
            )}
        </Styled.HomeContainer>
    );
};

export default HomeComponent;

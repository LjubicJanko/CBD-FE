import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import Section from '../../components/section/Section.component';
import * as Styled from './Home.styles';
import PageBanner from '../../components/page-banner/PageBanner.component';
import NoContent from '../../components/no-content/NoContent.component';
import { publicTenantService } from '../../api';
import { isReservedSlug } from '../../util/reservedSlugs';

const HomeComponent = () => {
    const { t } = useTranslation();
    const { tenantSlug } = useParams<{ tenantSlug?: string }>();
    const envSlug = import.meta.env.VITE_TENANT_SLUG as string | undefined;

    const [loading, setLoading] = useState<boolean>(Boolean(tenantSlug));
    const [notFound, setNotFound] = useState<boolean>(false);

    useEffect(() => {
        if (!tenantSlug) {
            setLoading(false);
            setNotFound(false);
            return;
        }
        // Defensive: the /:tenantSlug catch-all matches anything. Don't fire
        // a doomed lookup for /<reserved> — render the not-found state.
        if (isReservedSlug(tenantSlug)) {
            setLoading(false);
            setNotFound(true);
            return;
        }
        setLoading(true);
        setNotFound(false);
        publicTenantService
            .getTenantBySlug(tenantSlug)
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [tenantSlug]);

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
            <div className="home__sections">
                {tenantSlug && (
                    <Section
                        title={t('Poruči dres')}
                        to={`/order-extension/${tenantSlug}`}
                        panelClassName="home__sections__order-panel"
                    />
                )}
                <Section
                    title={t('ID Praćenje')}
                    to={tenantSlug ? `/track/${tenantSlug}` : '/track'}
                    panelClassName="home__sections__tracking-panel"
                />
            </div>
        </Styled.HomeContainer>
    );
};

export default HomeComponent;

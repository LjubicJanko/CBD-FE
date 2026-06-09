import { Button, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as Styled from './TenantDetails.styles';
import { platformService } from '../../api';
import { Tenant } from '../../api/services/platform';
import { TenantDetailsForm } from '../../components';
import { platformTenantFormService } from '../../components/tenant-details-form/tenantFormService';
import { useSnackbar } from '../../hooks/useSnackbar';
import localStorageService from '../../services/localStorage.service';

/**
 * Superadmin per-tenant detail/edit screen, reached from the platform table at
 * `/platform/tenants/:id`. Guarded by `SuperadminRoute`, so the full editable
 * form (including the slug) is always available here.
 */
const TenantDetailsPage: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const service = useMemo(
        () => (tenant ? platformTenantFormService(tenant.id) : null),
        [tenant]
    );

    // Keep the local tenant in sync after a save, and — if the superadmin just
    // edited the tenant they are currently impersonating — refresh the cached
    // selection so slug/feature changes take effect immediately without a
    // re-select.
    const handleSaved = useCallback((updated: Tenant) => {
        setTenant(updated);
        localStorageService.recacheSelectedTenant(updated);
    }, []);

    useEffect(() => {
        const tenantId = Number(id);
        if (!id || Number.isNaN(tenantId)) {
            setIsLoading(false);
            return;
        }
        let cancelled = false;
        setIsLoading(true);
        platformService
            .getTenant(tenantId)
            .then((data) => {
                if (!cancelled) setTenant(data);
            })
            .catch((error) => {
                if (cancelled) return;
                console.error(error);
                showSnackbar(t('platform.fetchError'), 'error');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [id, showSnackbar, t]);

    if (isLoading) {
        return (
            <div className="loader-wrapper">
                <CircularProgress />
            </div>
        );
    }

    return (
        <Styled.TenantDetailsContainer className="tenant-details">
            <div className="tenant-details__header">
                <Button
                    className="tenant-details__back"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/platform')}
                >
                    {t('tenantDetails.backToList')}
                </Button>
                <h2>{tenant ? tenant.name : t('tenantDetails.notFound')}</h2>
            </div>

            {tenant && service ? (
                <section className="tenant-details__section">
                    <TenantDetailsForm
                        tenant={tenant}
                        allowSlugEdit
                        allowFeatureEdit
                        service={service}
                        onSaved={handleSaved}
                    />
                </section>
            ) : (
                <p className="tenant-details__not-found">
                    {t('tenantDetails.notFound')}
                </p>
            )}
        </Styled.TenantDetailsContainer>
    );
};

export default TenantDetailsPage;

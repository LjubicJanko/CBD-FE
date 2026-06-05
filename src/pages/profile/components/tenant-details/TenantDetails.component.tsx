import { CircularProgress } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { platformService, tenantSelfService } from '../../../../api';
import { Tenant } from '../../../../api/services/platform';
import localStorageService from '../../../../services/localStorage.service';
import { TenantDetailsForm } from '../../../../components';
import {
    platformTenantFormService,
    selfTenantFormService,
} from '../../../../components/tenant-details-form/tenantFormService';
import { useIsSuperadmin } from '../../../../hooks/useRole';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import * as Styled from './TenantDetails.styles';

/**
 * "Tenant details" tab inside /profile. Lets a client admin edit their own
 * tenant's name, logo and social link. Slug editing is reserved for superadmins.
 *
 * Both read and write are role-specific because `/platform/**` is superadmin-only
 * (a client admin would get 403):
 *  - superadmin: read the impersonated tenant via platformService.getTenant and
 *    write through the platform endpoints.
 *  - client admin: read + write OWN tenant via the JWT-scoped self-service
 *    endpoints (`/profile/tenant`).
 */
const TenantDetails = () => {
    const { t } = useTranslation();
    const isSuperadmin = useIsSuperadmin();
    const { showSnackbar } = useSnackbar();

    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async (): Promise<Tenant | null> => {
            if (isSuperadmin) {
                const id = localStorageService.selectedTenantId;
                if (id === null) return null;
                return platformService.getTenant(id);
            }
            return tenantSelfService.getMyTenant();
        };

        setIsLoading(true);
        load()
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
    }, [isSuperadmin, showSnackbar, t]);

    const service = useMemo(() => {
        if (!tenant) return null;
        return isSuperadmin
            ? platformTenantFormService(tenant.id)
            : selfTenantFormService;
    }, [isSuperadmin, tenant]);

    if (isLoading) {
        return (
            <div className="loader-wrapper">
                <CircularProgress />
            </div>
        );
    }

    if (!tenant || !service) {
        return (
            <Styled.TenantDetailsTab className="tenant-details-tab">
                <p className="tenant-details-tab__empty">
                    {t('platform.noActiveTenant')}
                </p>
            </Styled.TenantDetailsTab>
        );
    }

    return (
        <Styled.TenantDetailsTab className="tenant-details-tab">
            <h3>{t('tenantDetails.title')}</h3>
            <TenantDetailsForm
                tenant={tenant}
                allowSlugEdit={isSuperadmin}
                service={service}
                onSaved={setTenant}
            />
        </Styled.TenantDetailsTab>
    );
};

export default TenantDetails;

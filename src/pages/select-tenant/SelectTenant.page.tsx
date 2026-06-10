import { CircularProgress } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { platformService } from '../../api';
import { getLogoAbsoluteUrl, Tenant } from '../../api/services/platform';
import localStorageService from '../../services/localStorage.service';
import { firstEnabledModuleRoute } from '../../util/features';
import * as Styled from './SelectTenant.styles';

const SelectTenantPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        platformService
            .getTenants()
            .then((data) => setTenants(data.filter((tenant) => tenant.active)))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const handleTenantSelect = useCallback(
        (tenantId: number) => {
            const picked = tenants.find((tenant) => tenant.id === tenantId);
            const features = picked?.features ?? [];
            localStorageService.setSelectedTenant(
                tenantId,
                picked?.slug ?? null,
                features,
                {
                    accentColor: picked?.accentColor ?? null,
                    backgroundColor: picked?.backgroundColor ?? null,
                }
            );
            // Hard navigation: drops in-memory caches (OrdersProvider, fetched
            // lists) that may be scoped to a previous tenant context. Matches
            // the header tenant-switch behavior for symmetry. Land on the
            // tenant's first enabled module (usually /dashboard).
            window.location.href = firstEnabledModuleRoute(features);
        },
        [tenants]
    );

    const handleGoToPlatform = useCallback(() => {
        navigate('/platform');
    }, [navigate]);

    if (isLoading) {
        return (
            <Styled.SelectTenantContainer>
                <div className="loader-wrapper">
                    <CircularProgress />
                </div>
            </Styled.SelectTenantContainer>
        );
    }

    return (
        <Styled.SelectTenantContainer className="select-tenant">
            <div className="select-tenant__heading">
                <h1>{t('selectTenant.title')}</h1>
            </div>
            <p className="select-tenant__subtitle">
                {t('selectTenant.subtitle')}
            </p>
            <div className="select-tenant__grid">
                {tenants.map((tenant) => {
                    const logoUrl = getLogoAbsoluteUrl(tenant.logoUrl);
                    return (
                        <div
                            key={tenant.id}
                            className="select-tenant__card"
                            role="button"
                            tabIndex={0}
                            onClick={() => handleTenantSelect(tenant.id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleTenantSelect(tenant.id);
                                }
                            }}
                        >
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={tenant.name}
                                    className="select-tenant__logo"
                                />
                            ) : (
                                <div className="select-tenant__logo-placeholder">
                                    {tenant.name.charAt(0)}
                                </div>
                            )}
                            <h3 className="select-tenant__name">
                                {tenant.name}
                            </h3>
                            <span className="select-tenant__slug">
                                {tenant.slug}
                            </span>
                        </div>
                    );
                })}
                <div
                    className="select-tenant__card select-tenant__card--platform"
                    role="button"
                    tabIndex={0}
                    onClick={handleGoToPlatform}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleGoToPlatform();
                        }
                    }}
                >
                    <AdminPanelSettingsIcon className="select-tenant__platform-icon" />
                    <span className="select-tenant__platform-label">
                        {t('selectTenant.managePlatform')}
                    </span>
                </div>
            </div>
        </Styled.SelectTenantContainer>
    );
};

export default SelectTenantPage;

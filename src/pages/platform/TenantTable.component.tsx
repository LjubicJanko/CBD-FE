import { Button } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getLogoAbsoluteUrl, Tenant } from '../../api/services/platform';
import localStorageService from '../../services/localStorage.service';

type TenantRowProps = {
    tenant: Tenant;
    busy: boolean;
    logoCacheBust: number;
    onDeactivate: (tenant: Tenant) => void;
};

const TenantRow: React.FC<TenantRowProps> = ({
    tenant,
    busy,
    logoCacheBust,
    onDeactivate,
}) => {
    const { t } = useTranslation();
    const absoluteLogoUrl = getLogoAbsoluteUrl(tenant.logoUrl, logoCacheBust);
    const isInactive = !tenant.active;

    // Impersonate this tenant, then jump to its settings. Hard navigation (like
    // the header tenant switch) drops tenant-scoped in-memory caches and forces
    // providers/guards to re-read the freshly-selected tenant from localStorage.
    const handleManage = () => {
        localStorageService.setSelectedTenant(
            tenant.id,
            tenant.slug,
            tenant.features,
            {
                accentColor: tenant.accentColor,
                backgroundColor: tenant.backgroundColor,
            }
        );
        window.location.href = '/profile';
    };

    return (
        <tr className={isInactive ? 'inactive' : undefined}>
            <td data-label="ID">{tenant.id}</td>
            <td data-label={t('platform.logo')}>
                {absoluteLogoUrl ? (
                    <img
                        src={absoluteLogoUrl}
                        alt={tenant.name}
                        className="platform__logo-thumb"
                    />
                ) : (
                    <span className="platform__logo-missing">—</span>
                )}
            </td>
            <td data-label={t('platform.tenantName')}>
                {tenant.name}
                {isInactive && (
                    <span className="platform__inactive-pill">
                        {t('platform.inactiveLabel')}
                    </span>
                )}
            </td>
            <td data-label={t('platform.tenantSlug')}>{tenant.slug}</td>
            <td data-label={t('platform.actions')}>
                {!isInactive && (
                    <div className="platform__actions">
                        <Button
                            size="small"
                            variant="outlined"
                            endIcon={<LaunchIcon />}
                            onClick={handleManage}
                        >
                            {t('settings')}
                        </Button>
                        <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            disabled={busy}
                            onClick={() => onDeactivate(tenant)}
                        >
                            {t('platform.deactivate')}
                        </Button>
                    </div>
                )}
            </td>
        </tr>
    );
};

type TenantTableProps = {
    tenants: Tenant[];
    busyTenantIds: Set<number>;
    logoCacheBust: number;
    onDeactivate: (tenant: Tenant) => void;
};

const TenantTable: React.FC<TenantTableProps> = ({
    tenants,
    busyTenantIds,
    logoCacheBust,
    onDeactivate,
}) => {
    const { t } = useTranslation();

    return (
        <section className="platform__section platform__section--list">
            <h3>{t('platform.tenantList')}</h3>
            <div className="platform__table-wrap">
                <table className="platform__table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>{t('platform.logo')}</th>
                            <th>{t('platform.tenantName')}</th>
                            <th>{t('platform.tenantSlug')}</th>
                            <th>{t('platform.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tenants.map((tenant) => (
                            <TenantRow
                                key={tenant.id}
                                tenant={tenant}
                                busy={busyTenantIds.has(tenant.id)}
                                logoCacheBust={logoCacheBust}
                                onDeactivate={onDeactivate}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default TenantTable;

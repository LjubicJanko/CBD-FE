import { CircularProgress } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Styled from './Platform.styles';
import { platformService } from '../../api';
import { Tenant } from '../../api/services/platform';
import { useSnackbar } from '../../hooks/useSnackbar';
import CreateTenantForm from './CreateTenantForm.component';
import TenantTable from './TenantTable.component';
import DeactivateTenantDialog from './DeactivateTenantDialog.component';

const PlatformPage: React.FC = () => {
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();

    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [busyTenantIds, setBusyTenantIds] = useState<Set<number>>(new Set());
    const [tenantToDeactivate, setTenantToDeactivate] = useState<Tenant | null>(
        null
    );
    const [isDeactivating, setIsDeactivating] = useState(false);
    // Stable per-mount value: busts the browser cache for tenant logos so an
    // updated logo shows on the next visit to this page.
    const [logoCacheBust] = useState<number>(Date.now());

    const markBusy = useCallback((id: number, busy: boolean) => {
        setBusyTenantIds((prev) => {
            const next = new Set(prev);
            if (busy) next.add(id);
            else next.delete(id);
            return next;
        });
    }, []);

    // Background refetch — does NOT touch isInitialLoading, so deactivation
    // doesn't blank the whole table.
    const fetchTenants = useCallback(async () => {
        try {
            const data = await platformService.getTenants();
            setTenants(data);
        } catch (error) {
            console.error(error);
            showSnackbar(t('platform.fetchError'), 'error');
        }
    }, [showSnackbar, t]);

    useEffect(() => {
        // Only the initial mount toggles the full-page spinner. Per-action
        // refetches go through fetchTenants() silently.
        let cancelled = false;
        platformService
            .getTenants()
            .then((data) => {
                if (!cancelled) setTenants(data);
            })
            .catch((error) => {
                if (cancelled) return;
                console.error(error);
                showSnackbar(t('platform.fetchError'), 'error');
            })
            .finally(() => {
                if (!cancelled) setIsInitialLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [showSnackbar, t]);

    const confirmDeactivate = useCallback(async () => {
        if (!tenantToDeactivate) return;
        const id = tenantToDeactivate.id;
        setIsDeactivating(true);
        markBusy(id, true);
        try {
            await platformService.deleteTenant(id);
            await fetchTenants();
            showSnackbar(t('platform.tenantDeactivated'), 'success');
            setTenantToDeactivate(null);
        } catch (error) {
            console.error(error);
            showSnackbar(t('platform.tenantDeleteError'), 'error');
        } finally {
            markBusy(id, false);
            setIsDeactivating(false);
        }
    }, [tenantToDeactivate, fetchTenants, markBusy, showSnackbar, t]);

    if (isInitialLoading) {
        return (
            <div className="loader-wrapper">
                <CircularProgress />
            </div>
        );
    }

    return (
        <Styled.PlatformContainer className="platform">
            <div className="platform__header">
                <h2>{t('platform.title')}</h2>
            </div>

            <div className="platform__layout">
                <CreateTenantForm onCreated={fetchTenants} />
                <TenantTable
                    tenants={tenants}
                    busyTenantIds={busyTenantIds}
                    logoCacheBust={logoCacheBust}
                    onDeactivate={setTenantToDeactivate}
                />
            </div>

            <DeactivateTenantDialog
                tenant={tenantToDeactivate}
                isDeactivating={isDeactivating}
                onCancel={() => setTenantToDeactivate(null)}
                onConfirm={confirmDeactivate}
            />
        </Styled.PlatformContainer>
    );
};

export default PlatformPage;

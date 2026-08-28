import { Button, CircularProgress } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { platformService } from '../../../../api';
import { Tenant } from '../../../../api/services/platform';
import localStorageService from '../../../../services/localStorage.service';
import FeatureToggles from '../../../../components/feature-toggles/FeatureToggles.component';
import { applyFeatureToggle, Feature } from '../../../../util/features';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import * as Styled from './PremiumFeatures.styles';

/**
 * Superadmin-only "Premium features" tab inside /profile. Manages the enabled
 * premium modules of the CURRENTLY-SELECTED (impersonated) tenant.
 *
 * Reads and writes go through the platform endpoints (`/platform/**`), which are
 * superadmin-only, a client admin must never reach this tab (it is omitted from
 * the tab list for non-superadmins) and could not grant their own tenant premium
 * modules even if they did. Mirrors the toggles on `/platform/tenants/:id` via
 * the shared `FeatureToggles` component.
 */
const PremiumFeatures = () => {
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();

    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [features, setFeatures] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const id = localStorageService.selectedTenantId;
        if (id === null) {
            setIsLoading(false);
            return;
        }
        let cancelled = false;
        setIsLoading(true);
        platformService
            .getTenant(id)
            .then((data) => {
                if (cancelled) return;
                setTenant(data);
                setFeatures(data.features);
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
    }, [showSnackbar, t]);

    const toggleFeature = useCallback((key: string, enabled: boolean) => {
        // applyFeatureToggle enforces dependencies: enabling needs prerequisites,
        // disabling cascades off dependents (e.g. turning off orders also turns
        // off reports and public order requests).
        setFeatures((prev) =>
            applyFeatureToggle(prev, key as Feature, enabled)
        );
    }, []);

    const isDirty = useMemo(() => {
        if (!tenant) return false;
        const next = [...features].sort().join(',');
        const current = [...tenant.features].sort().join(',');
        return next !== current;
    }, [features, tenant]);

    const handleSave = useCallback(async () => {
        if (!tenant) return;
        setIsSaving(true);
        try {
            // Send the tenant's current name/slug/socialLink unchanged alongside
            // the new features so the platform PUT (full-replace) doesn't clobber
            // them, this tab only owns the feature set.
            const updated = await platformService.updateTenant(tenant.id, {
                name: tenant.name,
                slug: tenant.slug,
                socialLink: tenant.socialLink,
                features,
            });
            setTenant(updated);
            setFeatures(updated.features);
            // Re-cache the impersonated tenant's features so the change takes
            // effect immediately, the reactive store re-renders the menu, route
            // guards and privilege-derived UI without a manual refresh.
            localStorageService.recacheSelectedTenant(updated);
            showSnackbar(t('tenantDetails.saved'), 'success');
        } catch (error) {
            console.error(error);
            showSnackbar(t('tenantDetails.saveError'), 'error');
        } finally {
            setIsSaving(false);
        }
    }, [tenant, features, showSnackbar, t]);

    if (isLoading) {
        return (
            <div className="loader-wrapper">
                <CircularProgress />
            </div>
        );
    }

    if (!tenant) {
        return (
            <Styled.PremiumFeaturesTab className="premium-features-tab">
                <p className="premium-features-tab__empty">
                    {t('platform.noActiveTenant')}
                </p>
            </Styled.PremiumFeaturesTab>
        );
    }

    return (
        <Styled.PremiumFeaturesTab className="premium-features-tab">
            <h3>{t('premiumFeatures.title')}</h3>
            <p className="premium-features-tab__hint">
                {t('premiumFeatures.hint', { tenant: tenant.name })}
            </p>
            <FeatureToggles
                features={features}
                onToggle={toggleFeature}
                disabled={isSaving}
            />
            <Button
                className="premium-features-tab__save"
                variant="contained"
                onClick={handleSave}
                disabled={!isDirty || isSaving}
            >
                {isSaving ? (
                    <CircularProgress size={20} />
                ) : (
                    t('tenantDetails.save')
                )}
            </Button>
        </Styled.PremiumFeaturesTab>
    );
};

export default PremiumFeatures;

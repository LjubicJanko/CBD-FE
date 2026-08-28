import { Button, CircularProgress, MenuItem, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    getLogoAbsoluteUrl,
    SocialLink,
    SocialLinkType,
    Tenant,
} from '../../api/services/platform';
import { useSnackbar } from '../../hooks/useSnackbar';
import { RESERVED_SLUGS } from '../../util/reservedSlugs';
import { extractFieldErrors, validateLogoFile } from '../../util/tenantForm';
import FeatureToggles from '../feature-toggles/FeatureToggles.component';
import { applyFeatureToggle, Feature } from '../../util/features';
import { DEFAULT_COLORS } from '../../styles/theme';
import {
    applyTenantTheme,
    restoreBaselineTheme,
} from '../../styles/applyTenantTheme';
import { TenantFormService } from './tenantFormService';
import * as Styled from './TenantDetailsForm.styles';

type TenantDetailsFormProps = {
    tenant: Tenant;
    /**
     * Superadmin-only. The slug drives public URLs (tracking links, QR codes),
     * so client admins get a read-only field while superadmins can edit it.
     */
    allowSlugEdit: boolean;
    /**
     * Superadmin-only. Renders the premium feature/module toggles and includes
     * them in the save payload. A client admin must never be able to grant their
     * own tenant premium modules, so this is false in the self-service tab.
     */
    allowFeatureEdit?: boolean;
    /**
     * Superadmin-only. Renders the brand-color picker (accent + background) and
     * includes the colors in the save payload, with a live whole-UI preview.
     * Colors are superadmin-only writes (the self-service endpoint ignores
     * them), so this is only enabled where the form writes through the platform
     * service, the "Tenant details" tab in /profile for a superadmin.
     */
    allowColorEdit?: boolean;
    /**
     * The write operations to perform, platform endpoints for a superadmin,
     * JWT-scoped self-service endpoints for a client admin. See
     * `tenantFormService.ts`.
     */
    service: TenantFormService;
    /**
     * Called with the latest tenant after a successful name/slug save or logo
     * change, so the caller can refresh any cached copy of the tenant.
     */
    onSaved?: (updated: Tenant) => void;
};

/**
 * Editable tenant form shared by the superadmin detail page
 * (`/platform/tenants/:id`) and the client-admin "Tenant details" tab in
 * `/profile`. The concrete endpoints are injected via `service`, so the form
 * itself is agnostic to whether it's editing a tenant as a superadmin or a
 * client admin. The logo is uploaded/removed immediately on selection
 * (mirroring the platform list) so it never blocks the name/slug save.
 */
const TenantDetailsForm: React.FC<TenantDetailsFormProps> = ({
    tenant,
    allowSlugEdit,
    allowFeatureEdit = false,
    allowColorEdit = false,
    service,
    onSaved,
}) => {
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();

    const [logoUrl, setLogoUrl] = useState<string | null>(tenant.logoUrl);
    const [logoCacheBust, setLogoCacheBust] = useState<number>(Date.now());
    const [isLogoBusy, setIsLogoBusy] = useState(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: tenant.name,
            slug: tenant.slug,
            // An empty type means "no social link"; url/displayText are then
            // optional and the payload sends socialLink: null to clear it.
            socialType: tenant.socialLink?.type ?? ('' as SocialLinkType | ''),
            socialUrl: tenant.socialLink?.url ?? '',
            socialDisplayText: tenant.socialLink?.displayText ?? '',
            // The self-service /profile/tenant endpoint may not include features
            // (only superadmin edits them); default so this never blows up.
            features: tenant.features ?? [],
            // Brand colors, superadmin-only. Empty string means "no override"
            // (sent as null on submit -> default palette).
            accentColor: tenant.accentColor ?? '',
            backgroundColor: tenant.backgroundColor ?? '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required(t('validation.required.name')),
            slug: Yup.string()
                .matches(/^[a-z0-9-]+$/, t('platform.slugFormat'))
                .notOneOf(RESERVED_SLUGS, t('platform.slugReserved'))
                .required(t('validation.required.slug')),
            socialType: Yup.string().oneOf([
                '',
                'INSTAGRAM',
                'FACEBOOK',
                'WEBSITE',
            ]),
            socialUrl: Yup.string().when('socialType', {
                is: (v: string) => Boolean(v),
                then: (s) =>
                    s
                        .required(t('tenantDetails.socialUrlRequired'))
                        .url(t('tenantDetails.socialUrlInvalid'))
                        .max(2048, t('tenantDetails.socialUrlInvalid')),
                otherwise: (s) => s.optional(),
            }),
            socialDisplayText: Yup.string().when('socialType', {
                is: (v: string) => Boolean(v),
                then: (s) =>
                    s
                        .required(t('tenantDetails.socialDisplayRequired'))
                        .max(100, t('tenantDetails.socialDisplayTooLong')),
                otherwise: (s) => s.optional(),
            }),
            accentColor: Yup.string().matches(/^#[0-9A-Fa-f]{6}$/, {
                message: t('tenantDetails.colorInvalid'),
                excludeEmptyString: true,
            }),
            backgroundColor: Yup.string().matches(/^#[0-9A-Fa-f]{6}$/, {
                message: t('tenantDetails.colorInvalid'),
                excludeEmptyString: true,
            }),
        }),
        onSubmit: async (values, { setErrors }) => {
            try {
                const socialLink: SocialLink | null = values.socialType
                    ? {
                          type: values.socialType as SocialLinkType,
                          url: values.socialUrl.trim(),
                          displayText: values.socialDisplayText.trim(),
                      }
                    : null;
                // Slug is only sent when editable (superadmin / platform
                // service); the self-service endpoint ignores it.
                // socialLink is always sent explicitly: object = set, null = clear.
                const updated = await service.update({
                    name: values.name,
                    slug: allowSlugEdit ? values.slug : undefined,
                    socialLink,
                    // Only superadmin sends features; the self-service service
                    // ignores them regardless.
                    features: allowFeatureEdit ? values.features : undefined,
                    // Colors are superadmin-only too. Empty string -> null
                    // (clear). Omitted unless the color picker is enabled.
                    accentColor: allowColorEdit
                        ? values.accentColor || null
                        : undefined,
                    backgroundColor: allowColorEdit
                        ? values.backgroundColor || null
                        : undefined,
                });
                showSnackbar(t('tenantDetails.saved'), 'success');
                onSaved?.(updated);
            } catch (error) {
                const axErr = error as {
                    response?: { status?: number; data?: unknown };
                };
                if (axErr.response?.status === 400) {
                    const fieldErrors = extractFieldErrors(axErr.response.data);
                    if (fieldErrors) {
                        setErrors(fieldErrors);
                        return;
                    }
                    const beMsg = (axErr.response.data as { message?: string })
                        ?.message;
                    showSnackbar(beMsg || t('tenantDetails.saveError'), 'error');
                    return;
                }
                console.error(error);
                showSnackbar(t('tenantDetails.saveError'), 'error');
            }
        },
    });

    // Not memoized: it reads formik.values.features, a fresh array each render,
    // so useCallback would buy nothing here. applyFeatureToggle enforces the
    // dependency rules (rejects enabling without prerequisites; cascades off
    // dependents when a prerequisite is disabled).
    const toggleFeature = (key: string, enabled: boolean) => {
        formik.setFieldValue(
            'features',
            applyFeatureToggle(formik.values.features, key as Feature, enabled)
        );
    };

    // Colors only take effect for a tenant that has the `theming` feature. Read
    // it reactively from formik so the preview/warning track a toggle made in
    // the same session.
    const tenantHasTheming = formik.values.features.includes(Feature.THEMING);

    // Live whole-UI preview for the superadmin while editing: push the in-progress
    // colors onto the document so the platform chrome shows exactly what the
    // tenant will get, but ONLY when theming is enabled, so the preview matches
    // what the tenant's users actually see. On unmount (or when theming is off /
    // self-service form) the baseline is restored. applyTenantTheme ignores
    // invalid/partial hex, so typing is safe.
    const { accentColor: accentValue, backgroundColor: backgroundValue } =
        formik.values;
    useEffect(() => {
        if (!allowColorEdit || !tenantHasTheming) return;
        applyTenantTheme({
            accentColor: accentValue || null,
            backgroundColor: backgroundValue || null,
        });
        return () => restoreBaselineTheme();
    }, [allowColorEdit, tenantHasTheming, accentValue, backgroundValue]);

    const handleLogoSelected = useCallback(
        async (file: File | undefined) => {
            if (!file) return;
            const err = validateLogoFile(file, t);
            if (err) {
                showSnackbar(err, 'error');
                return;
            }
            setIsLogoBusy(true);
            try {
                const updated = await service.uploadLogo(file);
                setLogoUrl(updated.logoUrl);
                setLogoCacheBust(Date.now());
                showSnackbar(t('platform.logoUpdated'), 'success');
                onSaved?.(updated);
            } catch (error) {
                console.error(error);
                showSnackbar(t('platform.logoUploadError'), 'error');
            } finally {
                setIsLogoBusy(false);
            }
        },
        [service, onSaved, showSnackbar, t]
    );

    const handleRemoveLogo = useCallback(async () => {
        setIsLogoBusy(true);
        try {
            await service.removeLogo();
            setLogoUrl(null);
            setLogoCacheBust(Date.now());
            showSnackbar(t('platform.logoRemoved'), 'success');
            onSaved?.({ ...tenant, logoUrl: null });
        } catch (error) {
            console.error(error);
            showSnackbar(t('platform.logoRemoveError'), 'error');
        } finally {
            setIsLogoBusy(false);
        }
    }, [service, tenant, onSaved, showSnackbar, t]);

    const absoluteLogoUrl = getLogoAbsoluteUrl(logoUrl, logoCacheBust);

    // Not memoized for the same reason as toggleFeature: it reads fresh formik
    // state each render. Renders a swatch + hex field + clear for one color.
    const renderColorField = (
        name: 'accentColor' | 'backgroundColor',
        labelKey: string
    ) => {
        const value = formik.values[name];
        const fallback =
            name === 'accentColor'
                ? DEFAULT_COLORS.accent
                : DEFAULT_COLORS.background;
        const hasError =
            formik.touched[name] && Boolean(formik.errors[name]);
        return (
            <div className="tenant-form__color">
                <span className="tenant-form__color-label">{t(labelKey)}</span>
                <div className="tenant-form__color-row">
                    <input
                        type="color"
                        aria-label={t(labelKey)}
                        className="tenant-form__color-swatch"
                        value={value || fallback}
                        onChange={(e) =>
                            formik.setFieldValue(
                                name,
                                e.target.value.toUpperCase()
                            )
                        }
                    />
                    <TextField
                        name={name}
                        value={value}
                        placeholder={fallback}
                        onChange={(e) =>
                            formik.setFieldValue(
                                name,
                                e.target.value.toUpperCase()
                            )
                        }
                        onBlur={formik.handleBlur}
                        error={hasError}
                        helperText={hasError ? formik.errors[name] : undefined}
                        size="small"
                    />
                    {value && (
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => formik.setFieldValue(name, '')}
                        >
                            {t('tenantDetails.colorReset')}
                        </Button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Styled.TenantDetailsForm className="tenant-form">
            <form onSubmit={formik.handleSubmit} className="tenant-form__fields">
                <TextField
                    fullWidth
                    label={t('platform.tenantName')}
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                    fullWidth
                    label={t('platform.tenantSlug')}
                    name="slug"
                    value={formik.values.slug}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!allowSlugEdit}
                    error={
                        allowSlugEdit &&
                        formik.touched.slug &&
                        Boolean(formik.errors.slug)
                    }
                    helperText={
                        allowSlugEdit
                            ? (formik.touched.slug && formik.errors.slug) ||
                              t('tenantDetails.slugWarning')
                            : t('tenantDetails.slugReadOnly')
                    }
                />

                <div className="tenant-form__social">
                    <span className="tenant-form__section-label">
                        {t('tenantDetails.socialSection')}
                    </span>
                    <TextField
                        select
                        fullWidth
                        label={t('tenantDetails.socialType')}
                        name="socialType"
                        value={formik.values.socialType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <MenuItem value="">
                            {t('tenantDetails.socialNone')}
                        </MenuItem>
                        <MenuItem value="INSTAGRAM">Instagram</MenuItem>
                        <MenuItem value="FACEBOOK">Facebook</MenuItem>
                        <MenuItem value="WEBSITE">
                            {t('tenantDetails.socialWebsite')}
                        </MenuItem>
                    </TextField>
                    {formik.values.socialType && (
                        <>
                            <TextField
                                fullWidth
                                label={t('tenantDetails.socialUrl')}
                                name="socialUrl"
                                placeholder="https://"
                                value={formik.values.socialUrl}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.socialUrl &&
                                    Boolean(formik.errors.socialUrl)
                                }
                                helperText={
                                    formik.touched.socialUrl &&
                                    formik.errors.socialUrl
                                }
                            />
                            <TextField
                                fullWidth
                                label={t('tenantDetails.socialDisplayText')}
                                name="socialDisplayText"
                                value={formik.values.socialDisplayText}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.socialDisplayText &&
                                    Boolean(formik.errors.socialDisplayText)
                                }
                                helperText={
                                    formik.touched.socialDisplayText &&
                                    formik.errors.socialDisplayText
                                }
                            />
                        </>
                    )}
                </div>

                {allowFeatureEdit && (
                    <div className="tenant-form__features">
                        <span className="tenant-form__section-label">
                            {t('tenantDetails.featuresSection')}
                        </span>
                        <FeatureToggles
                            features={formik.values.features}
                            onToggle={toggleFeature}
                        />
                    </div>
                )}

                {allowColorEdit && (
                    <div className="tenant-form__colors">
                        <span className="tenant-form__section-label">
                            {t('tenantDetails.colorsSection')}
                        </span>
                        {!tenantHasTheming && (
                            <span className="tenant-form__colors-warning">
                                {t('tenantDetails.colorsThemingOff')}
                            </span>
                        )}
                        {renderColorField(
                            'accentColor',
                            'tenantDetails.accentColor'
                        )}
                        {renderColorField(
                            'backgroundColor',
                            'tenantDetails.backgroundColor'
                        )}
                        <span className="tenant-form__colors-hint">
                            {t('tenantDetails.colorsHint')}
                        </span>
                    </div>
                )}

                <div className="tenant-form__logo">
                    <span className="tenant-form__logo-label">
                        {t('platform.logo')}
                    </span>
                    <div className="tenant-form__logo-row">
                        {isLogoBusy ? (
                            <CircularProgress size={28} />
                        ) : absoluteLogoUrl ? (
                            <img
                                src={absoluteLogoUrl}
                                alt={formik.values.name}
                                className="tenant-form__logo-thumb"
                            />
                        ) : (
                            <span className="tenant-form__logo-missing">—</span>
                        )}
                        <Button
                            component="label"
                            size="small"
                            variant="outlined"
                            disabled={isLogoBusy}
                        >
                            {logoUrl
                                ? t('platform.replaceLogo')
                                : t('platform.uploadLogo')}
                            <input
                                type="file"
                                accept="image/png"
                                hidden
                                onChange={(e) =>
                                    handleLogoSelected(e.target.files?.[0])
                                }
                            />
                        </Button>
                        {logoUrl && (
                            <Button
                                size="small"
                                variant="outlined"
                                disabled={isLogoBusy}
                                onClick={handleRemoveLogo}
                            >
                                {t('platform.removeLogo')}
                            </Button>
                        )}
                    </div>
                    <span className="tenant-form__logo-hint">
                        {t('platform.logoHint')}
                    </span>
                </div>

                <Button
                    className="tenant-form__submit"
                    variant="contained"
                    type="submit"
                    disabled={
                        formik.isSubmitting ||
                        !formik.isValid ||
                        !formik.dirty
                    }
                >
                    {formik.isSubmitting ? (
                        <CircularProgress size={20} />
                    ) : (
                        t('tenantDetails.save')
                    )}
                </Button>
            </form>
        </Styled.TenantDetailsForm>
    );
};

export default TenantDetailsForm;

import { Button, CircularProgress, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Styled from './Platform.styles';
import { platformService } from '../../api';
import { getLogoAbsoluteUrl, Tenant } from '../../api/services/platform';
import { useSnackbar } from '../../hooks/useSnackbar';
import { RESERVED_SLUGS } from '../../util/reservedSlugs';
import CbdModal from '../../components/cbd-modal/CbdModal.component';

const MAX_LOGO_BYTES = 1024 * 1024;

// MethodArgumentNotValidException can serialize in a few shapes depending on
// Spring's exception handler. Try the common ones; return null if nothing
// parses (caller falls back to the generic snackbar).
const extractFieldErrors = (
    data: unknown
): Record<string, string> | null => {
    if (!data || typeof data !== 'object') return null;
    const body = data as Record<string, unknown>;

    // Spring default: errors: [{ field, defaultMessage }]
    if (Array.isArray(body.errors)) {
        const out: Record<string, string> = {};
        for (const entry of body.errors) {
            if (entry && typeof entry === 'object') {
                const e = entry as { field?: string; defaultMessage?: string; message?: string };
                const msg = e.defaultMessage ?? e.message;
                if (e.field && msg) out[e.field] = msg;
            }
        }
        return Object.keys(out).length ? out : null;
    }

    // ProblemDetail-style: errors: { slug: '...' }
    if (body.errors && typeof body.errors === 'object') {
        const out: Record<string, string> = {};
        for (const [k, v] of Object.entries(body.errors as Record<string, unknown>)) {
            if (typeof v === 'string') out[k] = v;
        }
        return Object.keys(out).length ? out : null;
    }

    // Custom map: fieldErrors: { slug: '...' }
    if (body.fieldErrors && typeof body.fieldErrors === 'object') {
        const out: Record<string, string> = {};
        for (const [k, v] of Object.entries(
            body.fieldErrors as Record<string, unknown>
        )) {
            if (typeof v === 'string') out[k] = v;
        }
        return Object.keys(out).length ? out : null;
    }

    return null;
};

const validateLogoFile = (
    file: File,
    t: (key: string) => string
): string | null => {
    if (file.type !== 'image/png') {
        return t('platform.logoMustBePng');
    }
    if (file.size > MAX_LOGO_BYTES) {
        return t('platform.logoTooLarge');
    }
    return null;
};

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
    const [newTenantLogo, setNewTenantLogo] = useState<File | null>(null);
    const [logoCacheBust, setLogoCacheBust] = useState<number>(Date.now());

    const markBusy = useCallback((id: number, busy: boolean) => {
        setBusyTenantIds((prev) => {
            const next = new Set(prev);
            if (busy) next.add(id);
            else next.delete(id);
            return next;
        });
    }, []);

    // Background refetch — does NOT touch isInitialLoading, so per-row actions
    // (upload logo, remove logo, deactivate) don't blank the whole table.
    const fetchTenants = useCallback(async () => {
        try {
            const data = await platformService.getTenants();
            setTenants(data);
        } catch (error) {
            console.error(error);
            showSnackbar(t('platform.fetchError'), 'error');
        }
    }, [showSnackbar, t]);

    const handleLogoFileSelected = useCallback(
        async (tenantId: number, file: File | undefined) => {
            if (!file) return;
            const err = validateLogoFile(file, t);
            if (err) {
                showSnackbar(err, 'error');
                return;
            }
            markBusy(tenantId, true);
            try {
                await platformService.uploadTenantLogo(tenantId, file);
                setLogoCacheBust(Date.now());
                await fetchTenants();
                showSnackbar(t('platform.logoUpdated'), 'success');
            } catch (error) {
                console.error(error);
                showSnackbar(t('platform.logoUploadError'), 'error');
            } finally {
                markBusy(tenantId, false);
            }
        },
        [fetchTenants, markBusy, showSnackbar, t]
    );

    const handleRemoveLogo = useCallback(
        async (tenantId: number) => {
            markBusy(tenantId, true);
            try {
                await platformService.deleteTenantLogo(tenantId);
                setLogoCacheBust(Date.now());
                await fetchTenants();
                showSnackbar(t('platform.logoRemoved'), 'success');
            } catch (error) {
                console.error(error);
                showSnackbar(t('platform.logoRemoveError'), 'error');
            } finally {
                markBusy(tenantId, false);
            }
        },
        [fetchTenants, markBusy, showSnackbar, t]
    );

    const handleNewLogoChange = useCallback(
        (file: File | undefined) => {
            if (!file) {
                setNewTenantLogo(null);
                return;
            }
            const err = validateLogoFile(file, t);
            if (err) {
                showSnackbar(err, 'error');
                return;
            }
            setNewTenantLogo(file);
        },
        [showSnackbar, t]
    );

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

    // Create tenant form
    const tenantFormik = useFormik({
        initialValues: { name: '', slug: '' },
        validationSchema: Yup.object({
            name: Yup.string().required(t('validation.required.name')),
            slug: Yup.string()
                .matches(
                    /^[a-z0-9-]+$/,
                    t('platform.slugFormat')
                )
                .notOneOf(RESERVED_SLUGS, t('platform.slugReserved'))
                .required(t('validation.required.slug')),
        }),
        onSubmit: async (values, { resetForm, setErrors }) => {
            try {
                const created = await platformService.createTenant(values);
                if (newTenantLogo) {
                    try {
                        await platformService.uploadTenantLogo(
                            created.id,
                            newTenantLogo
                        );
                        showSnackbar(t('platform.tenantCreated'), 'success');
                    } catch (logoError) {
                        console.error(logoError);
                        showSnackbar(
                            t('platform.tenantCreatedLogoFailed'),
                            'warning'
                        );
                    }
                } else {
                    showSnackbar(t('platform.tenantCreated'), 'success');
                }
                resetForm();
                setNewTenantLogo(null);
                fetchTenants();
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
                    showSnackbar(
                        beMsg || t('platform.tenantCreateError'),
                        'error'
                    );
                    return;
                }
                console.error(error);
                showSnackbar(t('platform.tenantCreateError'), 'error');
            }
        },
    });

    const handleDeleteTenant = useCallback((tenant: Tenant) => {
        setTenantToDeactivate(tenant);
    }, []);

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
                <section className="platform__section platform__section--form">
                    <h3>{t('platform.createTenant')}</h3>
                    <form
                        onSubmit={tenantFormik.handleSubmit}
                        className="platform__form"
                    >
                        <TextField
                            fullWidth
                            label={t('platform.tenantName')}
                            name="name"
                            value={tenantFormik.values.name}
                            onChange={tenantFormik.handleChange}
                            onBlur={tenantFormik.handleBlur}
                            error={
                                tenantFormik.touched.name &&
                                Boolean(tenantFormik.errors.name)
                            }
                            helperText={
                                tenantFormik.touched.name &&
                                tenantFormik.errors.name
                            }
                        />
                        <TextField
                            fullWidth
                            label={t('platform.tenantSlug')}
                            name="slug"
                            value={tenantFormik.values.slug}
                            onChange={tenantFormik.handleChange}
                            onBlur={tenantFormik.handleBlur}
                            error={
                                tenantFormik.touched.slug &&
                                Boolean(tenantFormik.errors.slug)
                            }
                            helperText={
                                tenantFormik.touched.slug &&
                                tenantFormik.errors.slug
                            }
                        />
                        <div className="platform__logo-picker">
                            <Button
                                component="label"
                                variant="outlined"
                                size="small"
                            >
                                {newTenantLogo
                                    ? newTenantLogo.name
                                    : t('platform.chooseLogo')}
                                <input
                                    type="file"
                                    accept="image/png"
                                    hidden
                                    onChange={(e) =>
                                        handleNewLogoChange(e.target.files?.[0])
                                    }
                                />
                            </Button>
                            {newTenantLogo && (
                                <Button
                                    size="small"
                                    onClick={() => setNewTenantLogo(null)}
                                >
                                    {t('platform.clearLogo')}
                                </Button>
                            )}
                            <span className="platform__logo-hint">
                                {t('platform.logoHint')}
                            </span>
                        </div>
                        <Button
                            className="platform__submit"
                            variant="contained"
                            type="submit"
                            disabled={
                                !tenantFormik.isValid || !tenantFormik.dirty
                            }
                        >
                            {t('platform.createTenant')}
                        </Button>
                    </form>
                </section>

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
                                {tenants.map((tenant) => {
                                    const absoluteLogoUrl = getLogoAbsoluteUrl(
                                        tenant.logoUrl,
                                        logoCacheBust
                                    );
                                    const rowBusy = busyTenantIds.has(tenant.id);
                                    const isInactive = !tenant.active;
                                    return (
                                        <tr
                                            key={tenant.id}
                                            className={
                                                isInactive ? 'inactive' : undefined
                                            }
                                        >
                                            <td data-label="ID">{tenant.id}</td>
                                            <td data-label={t('platform.logo')}>
                                                {rowBusy ? (
                                                    <CircularProgress
                                                        size={20}
                                                    />
                                                ) : absoluteLogoUrl ? (
                                                    <img
                                                        src={absoluteLogoUrl}
                                                        alt={tenant.name}
                                                        className="platform__logo-thumb"
                                                    />
                                                ) : (
                                                    <span className="platform__logo-missing">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td
                                                data-label={t(
                                                    'platform.tenantName'
                                                )}
                                            >
                                                {tenant.name}
                                                {isInactive && (
                                                    <span className="platform__inactive-pill">
                                                        {t(
                                                            'platform.inactiveLabel'
                                                        )}
                                                    </span>
                                                )}
                                            </td>
                                            <td
                                                data-label={t(
                                                    'platform.tenantSlug'
                                                )}
                                            >
                                                {tenant.slug}
                                            </td>
                                            <td
                                                data-label={t(
                                                    'platform.actions'
                                                )}
                                            >
                                                {!isInactive && (
                                                    <div className="platform__actions">
                                                        <Button
                                                            component="label"
                                                            size="small"
                                                            variant="outlined"
                                                            disabled={rowBusy}
                                                        >
                                                            {tenant.logoUrl
                                                                ? t(
                                                                      'platform.replaceLogo'
                                                                  )
                                                                : t(
                                                                      'platform.uploadLogo'
                                                                  )}
                                                            <input
                                                                type="file"
                                                                accept="image/png"
                                                                hidden
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    handleLogoFileSelected(
                                                                        tenant.id,
                                                                        e.target
                                                                            .files?.[0]
                                                                    )
                                                                }
                                                            />
                                                        </Button>
                                                        {tenant.logoUrl && (
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                disabled={
                                                                    rowBusy
                                                                }
                                                                onClick={() =>
                                                                    handleRemoveLogo(
                                                                        tenant.id
                                                                    )
                                                                }
                                                            >
                                                                {t(
                                                                    'platform.removeLogo'
                                                                )}
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            variant="outlined"
                                                            disabled={rowBusy}
                                                            onClick={() =>
                                                                handleDeleteTenant(
                                                                    tenant
                                                                )
                                                            }
                                                        >
                                                            {t(
                                                                'platform.deactivate'
                                                            )}
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
            <CbdModal
                isOpen={tenantToDeactivate !== null}
                onClose={() =>
                    !isDeactivating && setTenantToDeactivate(null)
                }
                title={t('platform.deactivateTitle')}
            >
                <div className="platform__deactivate-dialog">
                    <p>
                        {t('platform.deactivateConfirm', {
                            name: tenantToDeactivate?.name ?? '',
                        })}
                    </p>
                    <div className="platform__deactivate-dialog__actions">
                        <Button
                            variant="outlined"
                            onClick={() => setTenantToDeactivate(null)}
                            disabled={isDeactivating}
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={confirmDeactivate}
                            disabled={isDeactivating}
                        >
                            {isDeactivating ? (
                                <CircularProgress size={20} />
                            ) : (
                                t('platform.deactivate')
                            )}
                        </Button>
                    </div>
                </div>
            </CbdModal>
        </Styled.PlatformContainer>
    );
};

export default PlatformPage;

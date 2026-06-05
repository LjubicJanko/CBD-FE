import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { platformService } from '../../api';
import { useSnackbar } from '../../hooks/useSnackbar';
import { RESERVED_SLUGS } from '../../util/reservedSlugs';
import { extractFieldErrors, validateLogoFile } from '../../util/tenantForm';

type CreateTenantFormProps = {
    /** Called after a tenant is successfully created, to refresh the list. */
    onCreated: () => void;
};

const CreateTenantForm: React.FC<CreateTenantFormProps> = ({ onCreated }) => {
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();
    const [logo, setLogo] = useState<File | null>(null);

    const handleLogoChange = useCallback(
        (file: File | undefined) => {
            if (!file) {
                setLogo(null);
                return;
            }
            const err = validateLogoFile(file, t);
            if (err) {
                showSnackbar(err, 'error');
                return;
            }
            setLogo(file);
        },
        [showSnackbar, t]
    );

    const formik = useFormik({
        initialValues: { name: '', slug: '' },
        validationSchema: Yup.object({
            name: Yup.string().required(t('validation.required.name')),
            slug: Yup.string()
                .matches(/^[a-z0-9-]+$/, t('platform.slugFormat'))
                .notOneOf(RESERVED_SLUGS, t('platform.slugReserved'))
                .required(t('validation.required.slug')),
        }),
        onSubmit: async (values, { resetForm, setErrors }) => {
            try {
                const created = await platformService.createTenant(values);
                if (logo) {
                    try {
                        await platformService.uploadTenantLogo(
                            created.id,
                            logo
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
                setLogo(null);
                onCreated();
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

    return (
        <section className="platform__section platform__section--form">
            <h3>{t('platform.createTenant')}</h3>
            <form onSubmit={formik.handleSubmit} className="platform__form">
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
                    error={formik.touched.slug && Boolean(formik.errors.slug)}
                    helperText={formik.touched.slug && formik.errors.slug}
                />
                <div className="platform__logo-picker">
                    <Button component="label" variant="outlined" size="small">
                        {logo ? logo.name : t('platform.chooseLogo')}
                        <input
                            type="file"
                            accept="image/png"
                            hidden
                            onChange={(e) =>
                                handleLogoChange(e.target.files?.[0])
                            }
                        />
                    </Button>
                    {logo && (
                        <Button size="small" onClick={() => setLogo(null)}>
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
                    disabled={!formik.isValid || !formik.dirty}
                >
                    {t('platform.createTenant')}
                </Button>
            </form>
        </section>
    );
};

export default CreateTenantForm;

import { Alert, Button, CircularProgress, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Styled from './OrderExtension.styles';
import { orderService, publicTenantService } from '../../api';
import { getLogoAbsoluteUrl } from '../../api/services/platform';
import { PublicTenant } from '../../api/services/publicTenant';
import { useSnackbar } from '../../hooks/useSnackbar';
import {
    OrderContactInfo,
    OrderExtensionReqDto,
} from '../../types/OrderExtension';
import { useNavigate, useParams } from 'react-router-dom';
import PageBanner from '../../components/page-banner/PageBanner.component';
import NoContent from '../../components/no-content/NoContent.component';
import { isReservedSlug } from '../../util/reservedSlugs';
import { Feature } from '../../util/features';


type OrderExtensionData = {
    orderName: string;
    orderDescription: string;
    fullName: string;
    zipCode: string;
    city: string;
    address: string;
    phoneNumber: string;
};

const OrderExtensionPage: React.FC = () => {
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();

    const navigate = useNavigate();
    const { tenantSlug } = useParams<{ tenantSlug?: string }>();
    const envSlug = import.meta.env.VITE_TENANT_SLUG as string | undefined;

    const [tenant, setTenant] = useState<PublicTenant | null>(null);
    const [tenantLoading, setTenantLoading] = useState<boolean>(true);
    const [tenantError, setTenantError] = useState<boolean>(false);

    // Bare /order-extension (no slug): redirect to env default if configured,
    // otherwise fall through to the not-found state.
    useEffect(() => {
        if (!tenantSlug && envSlug) {
            navigate(`/order-extension/${envSlug}`, { replace: true });
        }
    }, [tenantSlug, envSlug, navigate]);

    useEffect(() => {
        if (!tenantSlug) {
            if (!envSlug) {
                // No slug AND no env fallback: show the not-found state.
                setTenantError(true);
                setTenantLoading(false);
            }
            // With an env fallback, stay in loading so the redirect-effect
            // above can fire without flashing the not-found UI for a tick.
            return;
        }
        // Defensive: don't fire a doomed lookup for a slug that collides with
        // an FE route — go straight to the not-found state.
        if (isReservedSlug(tenantSlug)) {
            setTenantError(true);
            setTenantLoading(false);
            return;
        }
        setTenantLoading(true);
        publicTenantService
            .getTenantBySlug(tenantSlug)
            .then((data) => setTenant(data))
            .catch(() => setTenantError(true))
            .finally(() => setTenantLoading(false));
    }, [tenantSlug, envSlug]);

    const initialValues: OrderExtensionData = useMemo(
        () => ({
            orderName: '',
            orderDescription: '',
            fullName: '',
            zipCode: '',
            city: '',
            address: '',
            phoneNumber: '',
        }),
        []
    );

    const validationSchema = Yup.object({
        orderName: Yup.string().required(t('validation.required.orderName')),
        orderDescription: Yup.string().required(
            t('validation.required.orderDescription')
        ),
        fullName: Yup.string().required(t('validation.required.fullName')),
        zipCode: Yup.string()
            .matches(/^\d{4,6}$/, t('validation.invalid.zipCode'))
            .required(t('validation.required.zipCode')),
        city: Yup.string().required(t('validation.required.city')),
        address: Yup.string().required(t('validation.required.address')),
        phoneNumber: Yup.string()
            .matches(/^[0-9+\s-]{6,20}$/, t('validation.invalid.phone'))
            .required(t('validation.required.phone')),
    });

    const onSubmit = useCallback(
        async (values: OrderExtensionData) => {
            if (!tenantSlug) return;
            try {
                const { orderName, orderDescription, ...contactInfo } = values;
                const orderExtensionReqDto: OrderExtensionReqDto = {
                    name: orderName,
                    description: orderDescription,
                    contactInfo: contactInfo as OrderContactInfo,
                };
                const { trackingId } = await orderService.createOrderExtension(
                    tenantSlug,
                    orderExtensionReqDto
                );
                navigate(`/track/${tenantSlug}/${trackingId}`);
                showSnackbar(t('orderExtension.createdSuccess'), 'success');
            } catch (error) {
                showSnackbar(t('orderExtension.createError'), 'error');
                console.error(error);
            }
        },
        [tenantSlug, navigate, showSnackbar, t]
    );

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
        enableReinitialize: true,
    });

    const isSubmitDisabled = !formik.isValid || !formik.dirty;

    if (tenantLoading) {
        return (
            <Styled.OrderExtensionContainer className="order-extension">
                <div className="order-extension__loader">
                    <CircularProgress />
                </div>
            </Styled.OrderExtensionContainer>
        );
    }

    // Premium gating: the public order-extension flow is hidden unless the
    // tenant has the `order-extension` feature enabled. Treated like not-found
    // so a disabled module leaves no trace. The backend is the real boundary
    // and rejects createOrderExtension for tenants without the feature.
    const featureEnabled = tenant?.features?.includes(Feature.ORDER_EXTENSION);

    if (tenantError || !tenant || !featureEnabled) {
        return (
            <Styled.OrderExtensionContainer className="order-extension">
                <NoContent message={t('orderExtension.tenantNotFound')} />
            </Styled.OrderExtensionContainer>
        );
    }

    const tenantLogo = getLogoAbsoluteUrl(tenant.logoUrl);

    return (
        <Styled.OrderExtensionContainer className="order-extension">
            <PageBanner page="ORDER" />
            <header className="order-extension__brand">
                {tenantLogo && (
                    <img
                        src={tenantLogo}
                        alt={tenant.name}
                        className="order-extension__brand__logo"
                    />
                )}
                <h1 className="order-extension__brand__name">{tenant.name}</h1>
            </header>
            <h2 className="order-extension__title">
                {t('orderExtension.title')}
            </h2>

            <form
                onSubmit={formik.handleSubmit}
                className="order-extension__form"
            >
                <div className="order-extension__left">
                    <TextField
                        fullWidth
                        margin="dense"
                        label={t('orderExtension.teamName')}
                        name="orderName"
                        value={formik.values.orderName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.orderName &&
                            Boolean(formik.errors.orderName)
                        }
                        helperText={
                            formik.touched.orderName && formik.errors.orderName
                        }
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        multiline
                        rows={4}
                        label={t('orderExtension.description')}
                        placeholder={t('orderExtension.descriptionPlaceholder')}
                        name="orderDescription"
                        value={formik.values.orderDescription}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.orderDescription &&
                            Boolean(formik.errors.orderDescription)
                        }
                        helperText={
                            formik.touched.orderDescription &&
                            formik.errors.orderDescription
                        }
                    />
                </div>

                <div className="order-extension__right">
                    <TextField
                        fullWidth
                        margin="dense"
                        label={t('full-name')}
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.fullName &&
                            Boolean(formik.errors.fullName)
                        }
                        helperText={
                            formik.touched.fullName && formik.errors.fullName
                        }
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label={t('contact.phone')}
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.phoneNumber &&
                            Boolean(formik.errors.phoneNumber)
                        }
                        helperText={
                            formik.touched.phoneNumber &&
                            formik.errors.phoneNumber
                        }
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label={t('contact.address')}
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.address &&
                            Boolean(formik.errors.address)
                        }
                        helperText={
                            formik.touched.address && formik.errors.address
                        }
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label={t('contact.city')}
                        name="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.city && Boolean(formik.errors.city)
                        }
                        helperText={formik.touched.city && formik.errors.city}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label={t('contact.postalCode')}
                        name="zipCode"
                        value={formik.values.zipCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.zipCode &&
                            Boolean(formik.errors.zipCode)
                        }
                        helperText={
                            formik.touched.zipCode && formik.errors.zipCode
                        }
                    />
                </div>
                <Alert severity="info" className="order-extension__disclaimer">
                    {t('orderExtension.disclaimer')}
                </Alert>

                <Button
                    className="order-extension__form__submit"
                    variant="contained"
                    type="submit"
                    fullWidth
                    disabled={isSubmitDisabled}
                >
                    {t('create')}
                </Button>
            </form>
        </Styled.OrderExtensionContainer>
    );
};

export default OrderExtensionPage;

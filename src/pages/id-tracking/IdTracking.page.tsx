import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import {
    Button,
    CircularProgress,
    IconButton,
    Step,
    Stepper,
    TextField,
} from '@mui/material';
import { AxiosError } from 'axios';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { orderService } from '../../api';
import NoContent from '../../components/no-content/NoContent.component';
import useQueryParams from '../../hooks/useQueryParams';
import { useSnackbar } from '../../hooks/useSnackbar';
import { OrderTracking, PostServices } from '../../types/Order';
import { ApiError } from '../../types/Response';
import { statuses, trackingUrl } from '../../util/util';
import * as Styled from './IdTracking.styles';
import PageBanner from '../../components/page-banner/PageBanner.component';
import ShareIcon from '@mui/icons-material/Share';


const IdTrackingPage = () => {
    const { t } = useTranslation();

    const {
        setQParam,
        params: { id },
    } = useQueryParams<{ id: string | undefined }>();
    const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(
        id
    );
    const [order, setOrder] = useState<OrderTracking>();
    const [error, setError] = useState<string>('');

    const { showSnackbar } = useSnackbar();
    const isPendingExtension = useMemo(
        () => order?.extension && order?.status === 'PENDING',
        [order?.extension, order?.status]
    );

    const [isEditing, setIsEditing] = useState(false);

    const validationSchema = useMemo(
        () =>
            Yup.object({
                orderName: Yup.string().required(t('validation.required.orderName')),
                orderDescription: Yup.string().required(t('validation.required.orderDescription')),
                fullName: Yup.string().required(t('validation.required.fullName')),
                zipCode: Yup.string()
                    .matches(/^\d{4,6}$/, t('validation.invalid.zipCode'))
                    .required(t('validation.required.zipCode')),
                city: Yup.string().required(t('validation.required.city')),
                address: Yup.string().required(t('validation.required.address')),
                phoneNumber: Yup.string()
                    .matches(/^[0-9+\s-]{6,20}$/, t('validation.invalid.phone'))
                    .required(t('validation.required.phone')),
            }),
        [t]
    );

    const formik = useFormik({
        initialValues: {
            orderName: order?.name ?? '',
            orderDescription: order?.description ?? '',
            fullName: order?.contactInfo?.fullName ?? '',
            phoneNumber: order?.contactInfo?.phoneNumber ?? '',
            address: order?.contactInfo?.address ?? '',
            city: order?.contactInfo?.city ?? '',
            zipCode: order?.contactInfo?.zipCode ?? '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (!order) return;
            console.log({order});
            try {
                const updated = await orderService.editExtension(id!, {
                    name: values.orderName,
                    description: values.orderDescription,
                    contactInfo: {
                        fullName: values.fullName,
                        phoneNumber: values.phoneNumber,
                        address: values.address,
                        city: values.city,
                        zipCode: values.zipCode,
                    },
                });
                setOrder(updated);
                setIsEditing(false);
                showSnackbar(t('extension-updated'), 'success');
            } catch {
                showSnackbar(t('extension-update-error'), 'error');
            }
        },
    });

    const formatDate = useCallback(
        (date: string) => dayjs(date).format('DD.MM.YYYY.'),
        []
    );

    const trackOrder = useCallback(
        async (trackingId: string) => {
            if (trackingId === order?.trackingId) return;
            setError('');

            try {
                const response = await orderService.trackOrder(trackingId);
                setOrder(response);
            } catch (error) {
                setError((error as AxiosError<ApiError>).message);
            }
        },
        [order?.trackingId]
    );

    useEffect(() => {
        if (!id) {
            setOrder(undefined);
            return;
        }

        trackOrder(id);
    }, [id, trackOrder]);

    if (id && !order && !error)
        return (
            <Styled.LoaderContainer>
                <CircularProgress />
            </Styled.LoaderContainer>
        );

    if (order !== undefined) {
        return (
            <Styled.IdTrackingDetailsContainer className="id-tracking-details">
                <PageBanner page="ID_TRACKING" />
                {/* Order Status */}
                <div className="id-tracking-details__status">
                    {`Status: ${t(order.status)}`}
                </div>

                {/* Stepper */}
                <div className="id-tracking-details__stepper">
                    <p className="id-tracking-details__stepper--title">
                        <p>
                            {t(`ID: ${id}`)}
                            <IconButton
                                onClick={() => {
                                    navigator.clipboard.writeText(id);
                                    showSnackbar(
                                        t('tracking-id-coppied'),
                                        'success'
                                    );
                                }}
                                className="id-tracking-details__stepper--title-copy"
                                edge="end"
                            >
                                <ContentCopyIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    showSnackbar(
                                        t('Url coppied to clipboard'),
                                        'success'
                                    );
                                }}
                                className="id-tracking-details__stepper--title-copy"
                                edge="end"
                            >
                                <ShareIcon />
                            </IconButton>
                        </p>
                    </p>

                    <div className="id-tracking-details__stepper--container">
                        <Stepper activeStep={statuses.indexOf(order.status)}>
                            {statuses.map((status) => (
                                <Step
                                    key={status}
                                    className={classNames({
                                        active:
                                            status === order.status ||
                                            (status === 'DESIGN' &&
                                                order.status === 'PENDING'),
                                    })}
                                >
                                    <div className="step"></div>
                                </Step>
                            ))}
                        </Stepper>
                    </div>
                </div>

                {/* Status Info */}
                <div className="id-tracking-details__status-info">
                    <img
                        src={`/${order.status}.png`}
                        alt="Current status icon"
                    />
                    <div className="id-tracking-details__status-info--text">
                        <p className="title">{t(`${order.status}-title`)}</p>
                        <p>{t(`${order.status}-disclaimer`)}</p>
                    </div>
                </div>

                {isEditing && isPendingExtension ? (
                    <form onSubmit={formik.handleSubmit} className="id-tracking-details__edit-form">
                        <div className="id-tracking-details__edit-form__header">
                            <p className="id-tracking-details__edit-form__header--title">
                                {t('edit-extension')}
                            </p>
                            <IconButton onClick={() => { formik.resetForm(); setIsEditing(false); }}>
                                <CloseIcon sx={{ color: '#fff' }} />
                            </IconButton>
                        </div>

                        <div className="id-tracking-details__edit-form__section">
                            <p className="id-tracking-details__edit-form__section--title">
                                {t('orderDetails.title')}
                            </p>
                            <div className="id-tracking-details__edit-form__fields">
                                <TextField
                                    fullWidth
                                    label={t('orderExtension.teamName')}
                                    name="orderName"
                                    value={formik.values.orderName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.orderName && Boolean(formik.errors.orderName)}
                                    helperText={formik.touched.orderName && formik.errors.orderName}
                                />
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label={t('orderExtension.description')}
                                    name="orderDescription"
                                    value={formik.values.orderDescription}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.orderDescription && Boolean(formik.errors.orderDescription)}
                                    helperText={formik.touched.orderDescription && formik.errors.orderDescription}
                                />
                            </div>
                        </div>

                        <div className="id-tracking-details__edit-form__section">
                            <p className="id-tracking-details__edit-form__section--title">
                                {t('contact-info')}
                            </p>
                            <div className="id-tracking-details__edit-form__fields">
                                <TextField
                                    fullWidth
                                    label={t('full-name')}
                                    name="fullName"
                                    value={formik.values.fullName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                                    helperText={formik.touched.fullName && formik.errors.fullName}
                                />
                                <TextField
                                    fullWidth
                                    label={t('contact.phone')}
                                    name="phoneNumber"
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                />
                                <TextField
                                    fullWidth
                                    label={t('contact.address')}
                                    name="address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                />
                                <TextField
                                    fullWidth
                                    label={t('contact.city')}
                                    name="city"
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.city && Boolean(formik.errors.city)}
                                    helperText={formik.touched.city && formik.errors.city}
                                />
                                <TextField
                                    fullWidth
                                    label={t('contact.postalCode')}
                                    name="zipCode"
                                    value={formik.values.zipCode}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                                    helperText={formik.touched.zipCode && formik.errors.zipCode}
                                />
                            </div>
                        </div>

                        <div className="id-tracking-details__edit-form__actions">
                            <Button
                                variant="outlined"
                                className="id-tracking-details__edit-form__actions--cancel"
                                onClick={() => { formik.resetForm(); setIsEditing(false); }}
                            >
                                {t('cancel')}
                            </Button>
                            <Button
                                variant="contained"
                                type="submit"
                                className="id-tracking-details__edit-form__actions--save"
                                disabled={!formik.isValid || !formik.dirty}
                            >
                                {t('save')}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="id-tracking-details__order-info">
                            <p className="id-tracking-details__order-info--title">
                                {t('orderDetails.title')}
                                {isPendingExtension && (
                                    <IconButton
                                        onClick={() => setIsEditing(true)}
                                        className="id-tracking-details__edit-btn"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                )}
                            </p>
                            <div className="id-tracking-details__order-info__container">
                                <div className="id-tracking-details__order-info__container--name">
                                    <p>{t('orderDetails.name')}</p>
                                    <p>{order.name}</p>
                                </div>
                                {!isPendingExtension && (
                                    <>
                                        <div className="id-tracking-details__order-info__container--left-to-pay">
                                            <p>{t('orderDetails.amountLeftToPay')}</p>
                                            <p>
                                                {order.legalEntity
                                                    ? order.amountLeftToPayWithTax
                                                    : order.amountLeftToPay}
                                            </p>
                                        </div>
                                        <div className="id-tracking-details__order-info__container--last-change">
                                            <p>{t('orderDetails.lastUpdatedDate')}</p>
                                            <p>{formatDate(order.lastUpdatedDate)}</p>
                                        </div>
                                        <div className="id-tracking-details__order-info__container--expected-due">
                                            <p>{t('orderDetails.plannedEndingDate')}</p>
                                            <p>
                                                {dayjs(order.plannedEndingDate).format(
                                                    'DD.MM.YYYY'
                                                )}
                                            </p>
                                        </div>
                                    </>
                                )}
                                <div className="id-tracking-details__order-info__container--description">
                                    <p>{t('orderDetails.description')}</p>
                                    <p>{order.description}</p>
                                </div>
                                {order.status === 'SHIPPED' && (
                                    <>
                                        <div className="id-tracking-details__order-info__container--postal-service">
                                            <p>{t('orderDetails.postalService')}</p>
                                            <p>{t(order.postalService)}</p>
                                        </div>
                                        <div className="id-tracking-details__order-info__container--postal-code">
                                            <p>{t('orderDetails.postalCode')}</p>
                                            <p>
                                                {order.postalCode}
                                                <IconButton
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(
                                                            order.postalCode
                                                        );
                                                        showSnackbar(
                                                            t('postal-code-coppied'),
                                                            'success'
                                                        );
                                                    }}
                                                    edge="end"
                                                >
                                                    <ContentCopyIcon />
                                                </IconButton>
                                            </p>
                                        </div>
                                        <div className="id-tracking-details__order-info__container--link">
                                            <p>{t('orderDetails.postalLink')}</p>
                                            <Button
                                                variant="outlined"
                                                target="_blank"
                                                href={`${
                                                    trackingUrl[
                                                        order.postalService as PostServices
                                                    ]
                                                }`}
                                                className="id-tracking-details__order-info__container--link-btn"
                                            >
                                                {t('track-here')}
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {order?.contactInfo && (
                            <div className="id-tracking-details__contact-info">
                                <p className="id-tracking-details__contact-info--title">
                                    {t('contact-info')}
                                </p>

                                <div className="id-tracking-details__contact-info__container">
                                    <div className="id-tracking-details__contact-info__container__fullName">
                                        <p>{t('full-name')}</p>
                                        <p>{order.contactInfo?.fullName}</p>
                                    </div>
                                    <div className="id-tracking-details__contact-info__container__phoneNumber">
                                        <p>{t('contact.phone')}</p>
                                        <p>{order.contactInfo?.phoneNumber}</p>
                                    </div>
                                    <div className="id-tracking-details__contact-info__container__address">
                                        <p>{t('contact.address')}</p>
                                        <p>{order.contactInfo?.address}</p>
                                    </div>
                                    <div className="id-tracking-details__contact-info__container__city">
                                        <p>{t('contact.city')}</p>
                                        <p>{order.contactInfo?.city}</p>
                                    </div>
                                    <div className="id-tracking-details__contact-info__container__zipCode">
                                        <p>{t('contact.postalCode')}</p>
                                        <p>{order.contactInfo?.zipCode}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Styled.IdTrackingDetailsContainer>
        );
    }

    return (
        <Styled.IdTrackingContainer className="id-tracking">
            <h2 className="id-tracking__title">
                {t('enterTrackingNumber')}
            </h2>
            <div className="id-tracking__search-container">
                <TextField
                    className="order-id-input"
                    placeholder={t('order-tracking-id')}
                    value={trackingOrderId}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setTrackingOrderId(event.target.value);
                    }}
                    multiline
                    maxRows={4}
                />
                <Button
                    className="order-id-search-btn"
                    variant="outlined"
                    disabled={!trackingOrderId}
                    onClick={() =>
                        trackingOrderId && setQParam('id', trackingOrderId)
                    }
                >
                    {t('search')}
                </Button>
            </div>
            {error && (
                <>
                    <NoContent message={t(error)} />
                </>
            )}
        </Styled.IdTrackingContainer>
    );
};

export default IdTrackingPage;

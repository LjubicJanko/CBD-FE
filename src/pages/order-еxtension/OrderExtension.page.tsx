import { Alert, Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as Styled from './OrderExtension.styles';
import { orderService } from '../../api';
import { useSnackbar } from '../../hooks/useSnackbar';
import {
  OrderContactInfo,
  OrderExtensionReqDto,
} from '../../types/OrderExtension';
import { useNavigate } from 'react-router-dom';
import InstagramButton from '../../components/instagram/InstagramButton.component';

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
      try {
        const { orderName, orderDescription, ...contactInfo } = values;
        const orderExtensionReqDto: OrderExtensionReqDto = {
          name: orderName,
          description: orderDescription,
          contactInfo: contactInfo as OrderContactInfo,
        };
        const { trackingId } = await orderService.createOrderExtension(
          orderExtensionReqDto
        );
        navigate(`/track?id=${trackingId}`);
        showSnackbar(t('orderExtension.createdSuccess'), 'success');
      } catch (error) {
        showSnackbar(t('orderExtension.createError'), 'error');
        console.error(error);
      }
    },
    [navigate, showSnackbar, t]
  );

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const isSubmitDisabled = !formik.isValid || !formik.dirty;

  return (
    <Styled.OrderExtensionContainer className="order-extension">
      <h2 className="order-extension__title">{t('orderExtension.title')}</h2>

      <form onSubmit={formik.handleSubmit} className="order-extension__form">
        <div className="order-extension__left">
          <TextField
            fullWidth
            margin="dense"
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
              formik.touched.orderDescription && formik.errors.orderDescription
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
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
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
              formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
            }
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />
          <TextField
            fullWidth
            margin="dense"
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
            margin="dense"
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
            margin="dense"
            label={t('contact.postalCode')}
            name="zipCode"
            value={formik.values.zipCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
            helperText={formik.touched.zipCode && formik.errors.zipCode}
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
      <InstagramButton className='extension-page-instagram-button'/>
    </Styled.OrderExtensionContainer>
  );
};

export default OrderExtensionPage;

import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as Styled from './OrderExtension.styles';
// import { orderService } from '../../api';
import { useSnackbar } from '../../hooks/useSnackbar';

type OrderExtensionData = {
  orderName: string;
  orderDescription: string;
  fullName: string;
  postalCode: string;
  city: string;
  address: string;
  phoneNumber: string;
};

const OrderExtensionPage: React.FC = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  const initialValues: OrderExtensionData = useMemo(
    () => ({
      orderName: '',
      orderDescription: '',
      fullName: '',
      postalCode: '',
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
    postalCode: Yup.string()
      .matches(/^\d{4,6}$/, t('validation.invalid.postalCode'))
      .required(t('validation.required.postalCode')),
    city: Yup.string().required(t('validation.required.city')),
    address: Yup.string().required(t('validation.required.address')),
    phoneNumber: Yup.string()
      .matches(/^[0-9+\s-]{6,20}$/, t('validation.invalid.phone'))
      .required(t('validation.required.phone')),
  });

  const onSubmit = useCallback(
    async (values: OrderExtensionData) => {
      try {
        // await orderService.createOrderExtension(values);
        console.log({ values });
        showSnackbar(t('orderExtension.createdSuccess'), 'success');
      } catch (error) {
        showSnackbar(t('orderExtension.createError'), 'error');
        console.error(error);
      }
    },
    [showSnackbar, t]
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
            label={t('Name')}
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
            label={t('Description')}
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
            label={t('contact.postalCode')}
            name="postalCode"
            value={formik.values.postalCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.postalCode && Boolean(formik.errors.postalCode)
            }
            helperText={formik.touched.postalCode && formik.errors.postalCode}
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
        </div>

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

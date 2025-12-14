import { FormikHelpers, useFormik } from 'formik';
import { ContactInfoData, Order } from '../../../../types/Order';
import * as Styled from './ContactInfoForm.styles';
import { useCallback, useContext, useMemo } from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Button, TextField } from '@mui/material';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import { orderService } from '../../../../api';
import OrdersContext from '../../../../store/OrdersProvider/Orders.context';

export type ContactInfoFormProps = {
  initialContactInfo?: ContactInfoData;
};

const emptyContactInfoData: ContactInfoData = {
  fullName: '',
  zipCode: '',
  city: '',
  address: '',
  phoneNumber: '',
};

const ContactInfoForm = ({ initialContactInfo }: ContactInfoFormProps) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const { selectedOrder, setSelectedOrder } = useContext(OrdersContext);

  const initialValues = useMemo(
    () => initialContactInfo ?? emptyContactInfoData,
    [initialContactInfo]
  );

  const onSubmit = useCallback(
    async (
      formData: ContactInfoData,
      { resetForm }: FormikHelpers<ContactInfoData>
    ) => {
      if (!selectedOrder) return;

      try {
        const { contactInfo }: Order = await orderService.editContactInfo(
          selectedOrder.id,
          formData
        );
        setSelectedOrder({
          ...selectedOrder,
          contactInfo: contactInfo,
        });
        resetForm({ values: formData });

        showSnackbar(t('Kontakt podaci su uspešno izmenjeni'), 'success');
      } catch (error) {
        showSnackbar(t('Kontakt podaci nisu izmenjeni'), 'error');
        console.error(error);
      }
    },
    [selectedOrder, setSelectedOrder, showSnackbar, t]
  );

  const validationSchema = Yup.object({
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

  const formik = useFormik<ContactInfoData>({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: true,
  });

  return (
    <Styled.ContactInfoFormContainer>
      <form
        autoComplete="off"
        onSubmit={formik.handleSubmit}
        className="edit-contact-info"
      >
        <div className="edit-contact-info__fields">
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
        <Button
          className="edit-contact-info__submit"
          variant="contained"
          type="submit"
          fullWidth
          disabled={!formik.isValid || !formik.dirty}
        >
          {t('edit')}
        </Button>
      </form>
    </Styled.ContactInfoFormContainer>
  );
};

export default ContactInfoForm;

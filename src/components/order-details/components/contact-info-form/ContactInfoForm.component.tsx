import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ContactInfoData } from '../../../../types/Order';
import * as Styled from './ContactInfoForm.styles';

export type ContactInfoFormProps = {
  contactInfo?: ContactInfoData;
};

const initialContactInfoData: ContactInfoData = {
  address: '',
  city: '',
  fullName: '',
  phoneNumber: '',
  zipCode: '',
};

const ContactInfoForm = ({ contactInfo }: ContactInfoFormProps) => {
  const { t } = useTranslation();
  // const validationSchema = Yup.object({
  //   address: Yup.string().required(t('validation.required.name')),
  //   city: Yup.string().required(t('validation.required.description')),
  //   fullName: Yup.string().required(t('validation.required.description')),
  //   phoneNumber: Yup.string().required(t('validation.required.description')),
  //   zipCode: Yup.string().required(t('validation.required.description')),
  // });

  console.log({ contactInfo });
  const initialValues: ContactInfoData = useMemo(
    () => contactInfo ?? initialContactInfoData,
    [contactInfo]
  );

  const onSubmit = useCallback(() => {}, []);

  const formik = useFormik<ContactInfoData>({
    initialValues,
    // validationSchema,
    onSubmit,
  });

  return (
    <Styled.ContactInfoFormContainer className="contact-info-form">
      <TextField
        className="contact-info-form__full-name"
        label={t('full-name')}
        name="fullName"
        type="text"
        value={formik.values.fullName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!formik.errors.fullName}
        helperText={formik.errors.fullName ?? ''}
      />
      <TextField
        className="contact-info-form__address"
        label={t('contact.address')}
        name="address"
        type="text"
        value={formik.values.address}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!formik.errors.address}
        helperText={formik.errors.address ?? ''}
      />
      <TextField
        className="contact-info-form__phoneNumber"
        label={t('contact.phone')}
        name="phoneNumber"
        type="text"
        value={formik.values.phoneNumber}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!formik.errors.phoneNumber}
        helperText={formik.errors.phoneNumber ?? ''}
      />
      <TextField
        className="contact-info-form__city"
        label={t('contact.city')}
        name="city"
        type="text"
        value={formik.values.city}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!formik.errors.city}
        helperText={formik.errors.city ?? ''}
      />
      <TextField
        className="contact-info-form__zipCode"
        label={t('contact.postalCode')}
        name="zipCode"
        type="text"
        value={formik.values.zipCode}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!formik.errors.zipCode}
        helperText={formik.errors.zipCode ?? ''}
      />

      <div className="contact-info-form__actions">
        <Button
          variant="outlined"
          className="contact-info-form__actions__cancel"
        >
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          variant="contained"
          className="contact-info-form__save"
        >
          {t('Save')}
        </Button>
      </div>
    </Styled.ContactInfoFormContainer>
  );
};

export default ContactInfoForm;

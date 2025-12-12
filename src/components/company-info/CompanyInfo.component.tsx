import { Button, InputLabel, MenuItem, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import CompanyContext from '../../store/CompanyProvider/Company.context';
import * as Styled from './CompanyInfo.styles';
import companyService from '../../api/services/companies';
import BannerImageUpload from './BannerImageUpload.component';

export type CompanyFormValues = {
  name: string;
  currency: string;
  vat: string;
  websiteUrl: string;
  colors: [string, string, string, string, string];
  bannerImage: string;
};

const CompanyInfo = () => {
  const { t } = useTranslation();
  const { company } = useContext(CompanyContext);

  const initialValues: CompanyFormValues = useMemo(
    () =>
      company
        ? {
            name: company.name || '',
            currency: company.currency || '',
            vat: company.vat || '',
            websiteUrl: company.websiteUrl || '',
            colors:
              company?.colors?.length === 5
                ? (company.colors as [string, string, string, string, string])
                : ['#000000', '#000000', '#000000', '#000000', '#000000'],
            bannerImage: '',
          }
        : {
            name: '',
            currency: '',
            vat: '',
            websiteUrl: '',
            colors: ['#000000', '#000000', '#000000', '#000000', '#000000'],
            bannerImage: '',
          },
    [company]
  );

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    currency: Yup.string().required('Currency is required'),
    vat: Yup.string().required('VAT is required'),
    websiteUrl: Yup.string().url('Invalid URL').nullable(),
    colors: Yup.array()
      .of(
        Yup.string()
          .matches(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid hex color')
          .required('Color is required')
      )
      .length(5, 'Must provide exactly 5 colors')
      .required('Colors are required'),
  });

  const onSubmit = useCallback(async (data: CompanyFormValues) => {
    if(!company?.id) return;

    const response = await companyService.updateInfo({
      ...data,
      id: +company?.id,
    });
    console.log({ response });
  }, [company]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  console.log(formik);

  const handleBannerImageChange = useCallback((base64: string) => {
    formik.setFieldValue('bannerImage', base64);
  }, [formik]);

  return (
    <Styled.CompanyInfoContainer>
      <form onSubmit={formik.handleSubmit} className="company-info-form">
        <div className="company-info-form__logo">
          <h2>{company?.name}</h2>
        </div>
        <div className="company-info-form__name-input">
          <InputLabel>{t('Naziv')}</InputLabel>
          <TextField
            fullWidth
            margin="normal"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </div>
        <div className="company-info-form__currency-input">
          <InputLabel>{t('Currency')}</InputLabel>
          <TextField
            select
            fullWidth
            name="currency"
            value={formik.values.currency}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.currency && Boolean(formik.errors.currency)}
            helperText={formik.touched.currency && formik.errors.currency}
          >
            {['USD', 'EUR', 'GBP'].map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="company-info-form__vat-input">
          <InputLabel>{t('VAT')}</InputLabel>
          <TextField
            select
            fullWidth
            name="vat"
            value={formik.values.vat}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.vat && Boolean(formik.errors.vat)}
            helperText={formik.touched.vat && formik.errors.vat}
          >
            {['0%', '5%', '10%', '20%'].map((v) => (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="company-info-form__link">
          <InputLabel>{t('Website')}</InputLabel>
          <TextField
            fullWidth
            margin="normal"
            name="websiteUrl"
            value={formik.values.websiteUrl}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.websiteUrl && Boolean(formik.errors.websiteUrl)
            }
            helperText={formik.touched.websiteUrl && formik.errors.websiteUrl}
          />
        </div>
        <div className="company-info-form__colors">
          <InputLabel>{t('Colors')}</InputLabel>
          {formik.values.colors.map((_, index) => (
            <TextField
              key={index}
              type="color"
              name={`colors[${index}]`}
              value={formik.values.colors[index]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginRight: 8, width: 18, height: 18 }}
            />
          ))}
        </div>
        <BannerImageUpload
          value={formik.values.bannerImage}
          onChange={handleBannerImageChange}
        />
        <div className="company-info-form__actions" style={{ marginTop: 20 }}>
          <Button variant="contained" color="primary">
            {t('Podigni fajl')}
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {t('Save')}
          </Button>
        </div>
      </form>
    </Styled.CompanyInfoContainer>
  );
};

export default CompanyInfo;

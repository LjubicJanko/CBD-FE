import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import { orderService } from '../../api';
import { CreateOrder } from '../../types/Order';
import * as Styled from './CreateOrder.styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BasicDatePicker } from '../../components';
import { Dayjs } from 'dayjs';
import * as Yup from 'yup';

const emptyOrderData: CreateOrder = {
  name: '',
  description: '',
  plannedEndingDate: '',
  legalEntity: false,
  acquisitionCost: undefined,
  salePrice: undefined,
};

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const initialValues = useMemo(() => emptyOrderData, []);

  const [plannedEndingDate, setPlannedEndingDate] = useState('');

  const onSubmit = useCallback(
    async (values: CreateOrder) => {
      try {
        await orderService.createOrder({
          ...values,
          plannedEndingDate: plannedEndingDate,
        });
        navigate('/');
      } catch (error) {
        console.error(error);
      }
    },
    [navigate, plannedEndingDate]
  );

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    salePrice: Yup.number()
      .positive()
      .required('Sale price is required')
      .min(0),
    acquisitionCost: Yup.number()
      .positive()
      .required('Acquisition cost is required')
      .min(0),
  });

  const formik = useFormik<CreateOrder>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const isSubmitDisabled = useMemo(() => {
    const hasErrors = Object.keys(formik.errors).length > 0;
    const isFormNotTouched = !formik.dirty && !formik.touched;
    const isFormInvalid = !formik.isValid;
    const isFormEmpty = Object.values(formik.values).every((x) => !x);

    return hasErrors || isFormNotTouched || isFormInvalid || isFormEmpty;
  }, [
    formik.dirty,
    formik.errors,
    formik.isValid,
    formik.touched,
    formik.values,
  ]);

  const handleDateChange = useCallback((newValue: Dayjs | null) => {
    console.log(
      'Selected Date:',
      newValue ? newValue.format('YYYY-MM-DD') : 'No date selected'
    );
    if (newValue) {
      setPlannedEndingDate(newValue?.format('YYYY-MM-DD'));
    }
  }, []);

  return (
    <Styled.CreateOrderPageContainer>
      {/* <h2 className="title">Create new order</h2> */}
      <form
        autoComplete="off"
        onSubmit={formik.handleSubmit}
        className="create-order"
      >
        <TextField
          className="create-order--name-input"
          label={t('order-name')}
          name="name"
          type="text"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.name}
          helperText={formik.errors.name ?? ''}
          multiline
          maxRows={4}
        />
        {/* {formik.errors.name && (
          <span className="create-order--error">{formik.errors.name}</span>
        )} */}
        <TextField
          className="create-order--description-input"
          label={t('description')}
          name="description"
          type="text"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.description}
          helperText={formik.errors.description ?? ''}
          multiline
          maxRows={4}
        />

        <BasicDatePicker label={t('expected')} onChange={handleDateChange} />
        {/* <input
          type="date"
          className="create-order--ending-date-input"
          id="plannedEndingDate"
          name="plannedEndingDate"
          onChange={formik.handleChange}
          value={formik.values.plannedEndingDate}
        /> */}

        <TextField
          label={t('sale-price')}
          name="salePrice"
          className="create-order--sale-price-input"
          type="number"
          value={formik.values.salePrice}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.salePrice}
          helperText={formik.errors.salePrice ?? ''}
        />

        <TextField
          label={t('acquisition-cost')}
          name="acquisitionCost"
          className="create-order--acquisition-cost-input"
          type="number"
          value={formik.values.acquisitionCost}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.acquisitionCost}
          helperText={formik.errors.acquisitionCost ?? ''}
        />

        <FormControlLabel
          label={t('is-legal-entity')}
          className="create-order--is-legal-input"
          control={
            <Checkbox
              name="legalEntity"
              checked={formik.values.legalEntity}
              onChange={formik.handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          }
        />
        <div className="create-order__footer">
          <Button
            className="create-order__footer--cancel-button"
            variant="outlined"
            size="large"
            onClick={() => navigate('/')}
          >
            {t('cancel')}
          </Button>
          <Button
            className="create-order__footer--submit-button"
            type="submit"
            size="large"
            variant="contained"
            disabled={isSubmitDisabled}
          >
            {t('create')}
          </Button>
        </div>
      </form>
    </Styled.CreateOrderPageContainer>
  );
};

export default CreateOrderPage;

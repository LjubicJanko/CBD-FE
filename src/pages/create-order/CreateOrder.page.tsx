import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Rating,
  TextField,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { orderService } from '../../api';
import { BasicDatePicker } from '../../components';
import { useSnackbar } from '../../hooks/useSnackbar';
import {
  CreateOrder,
  orderPriorityArray,
  OrderPriorityEnum,
} from '../../types/Order';
import * as Styled from './CreateOrder.styles';

const emptyOrderData: CreateOrder = {
  name: '',
  description: '',
  note: '',
  plannedEndingDate: dayjs().add(2, 'week'),
  legalEntity: false,
  acquisitionCost: undefined,
  salePrice: undefined,
  priority: OrderPriorityEnum.MEDIUM,
};

const CreateOrderPage = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const { showSnackbar } = useSnackbar();

  const initialValues = useMemo(() => emptyOrderData, []);

  const validationSchema = Yup.object({
    name: Yup.string().required(t('validation.required.name')),
    description: Yup.string().required(t('validation.required.description')),
    salePrice: Yup.number()
      .positive(t('validation.invalid.sale-price'))
      .required(t('validation.required.sale-price'))
      .min(0),
    acquisitionCost: Yup.number()
      .positive(t('validation.invalid.acquisition-cost'))
      .required(t('validation.required.acquisition-cost'))
      .min(0),
  });

  const onSubmit = useCallback(
    async (values: CreateOrder) => {
      try {
        await orderService.createOrder({
          ...values,
          plannedEndingDate: dayjs(values.plannedEndingDate).format(
            'YYYY-MM-DD'
          ),
        });
        showSnackbar(t('order-created'), 'success');
        navigate('/');
      } catch (error) {
        console.error(error);
      }
    },
    [navigate, showSnackbar, t]
  );

  const formik = useFormik<CreateOrder>({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: true,
  });

  const handleDateChange = useCallback(
    (newValue: Dayjs | null) => {
      if (newValue) {
        formik.setFieldValue('plannedEndingDate', newValue);
      }
    },
    [formik]
  );

  const isSubmitDisabled = useMemo(() => {
    const requiredFields: (keyof CreateOrder)[] = [
      'name',
      'description',
      'salePrice',
      'acquisitionCost',
    ];

    const areAllRequiredFieldsValid = requiredFields.every(
      (field) => formik.touched[field] && !formik.errors[field]
    );

    return !areAllRequiredFieldsValid;
  }, [formik.errors, formik.touched]);

  return (
    <Styled.CreateOrderPageContainer>
      <form
        autoComplete="off"
        onSubmit={formik.handleSubmit}
        className="create-order"
      >
        <h2 className="title">{t('create-order')}</h2>
        <Divider />
        <TextField
          className="create-order--name-input"
          label={t('order-name')}
          name="name"
          type="text"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.name && formik.touched.name}
          helperText={formik.touched.name && formik.errors.name}
          multiline
          maxRows={4}
        />
        <TextField
          className="create-order--description-input"
          label={t('description')}
          name="description"
          type="text"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.description && formik.touched.description}
          helperText={formik.touched.description && formik.errors.description}
          multiline
          maxRows={4}
        />
        <TextField
          className="create-order--note-input"
          label={t('note')}
          name="note"
          type="text"
          value={formik.values.note}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.note && formik.touched.note}
          helperText={formik.touched.note && formik.errors.note}
          multiline
          maxRows={4}
        />
        <BasicDatePicker
          label={t('expected')}
          onChange={handleDateChange}
          disablePast
          value={formik.values.plannedEndingDate as Dayjs}
        />

        <TextField
          label={t('acquisition-cost')}
          name="acquisitionCost"
          className="create-order--acquisition-cost-input"
          type="number"
          value={formik.values.acquisitionCost}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            !!formik.errors.acquisitionCost && formik.touched.acquisitionCost
          }
          helperText={
            formik.touched.acquisitionCost && formik.errors.acquisitionCost
          }
        />

        <TextField
          label={t('sale-price')}
          name="salePrice"
          className="create-order--sale-price-input"
          type="number"
          value={formik.values.salePrice}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.salePrice && formik.touched.salePrice}
          helperText={formik.touched.salePrice && formik.errors.salePrice}
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

        <Rating
          name="priority"
          max={3}
          value={orderPriorityArray.indexOf(formik.values.priority) + 1}
          onChange={(_, newValue) => {
            newValue &&
              formik.setFieldValue(
                'priority',
                orderPriorityArray[newValue - 1]
              );
          }}
        />

        <Divider />
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

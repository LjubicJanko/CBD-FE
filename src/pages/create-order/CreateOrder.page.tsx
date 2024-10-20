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

const emptyOrderData: CreateOrder = {
  name: '',
  description: '',
  plannedEndingDate: '',
  legalEntity: false,
  acquisitionCost: 0,
  salePrice: 0,
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

  const formik = useFormik<CreateOrder>({
    initialValues,
    onSubmit,
  });

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
        />

        <TextField
          label={t('acquisition-cost')}
          name="acquisitionCost"
          className="create-order--acquisition-cost-input"
          type="number"
          value={formik.values.acquisitionCost}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
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
          >
            {t('create')}
          </Button>
        </div>
      </form>
    </Styled.CreateOrderPageContainer>
  );
};

export default CreateOrderPage;

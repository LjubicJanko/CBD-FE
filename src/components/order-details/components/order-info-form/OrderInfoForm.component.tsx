import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { useCallback, useContext } from 'react';
import { BasicDatePicker } from '../../..';
import { orderService } from '../../../../api';
import { Order } from '../../../../types/Order';
import OrdersContext from '../../../../store/OrdersProvider/Orders.context';
import { useTranslation } from 'react-i18next';
import * as Styled from './OrderInfoForm.styles';

export type OrderInfoFormProps = {
  orderData: Order;
};

const OrderInfoForm = ({ orderData }: OrderInfoFormProps) => {
  const { t } = useTranslation();
  const { fetchOrders } = useContext(OrdersContext);

  const onSubmit = useCallback(
    async (values: Order) => {
      try {
        const res = await orderService.updateOrder(values);
        console.log(res);
        // todo check if we should refetch, or just update frontend array
        fetchOrders();
      } catch (error) {
        console.error(error);
      }
    },
    [fetchOrders]
  );

  const formik = useFormik<Order>({
    initialValues: orderData,
    onSubmit,
  });

  return (
    <Styled.OrderInfoFormContainer
      autoComplete="off"
      onSubmit={formik.handleSubmit}
    >
      <TextField
        className="order-name-input"
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
        className="order-description-input"
        label={t('description')}
        name="description"
        type="text"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        multiline
        maxRows={4}
      />
      <TextField
        className="order-sale-price-input"
        label={t('sale-price')}
        type="number"
        name="salePrice"
        value={formik.values.salePrice}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <TextField
        className="order-acquisition-cost-input"
        label={t('acquisition-cost')}
        type="number"
        name="acquisitionCost"
        value={formik.values.acquisitionCost}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <div
        className="date-input-container"
        style={{ display: 'flex', gap: '16px', alignItems: 'end' }}
      >
        <p>{t('expected')}</p>
        <BasicDatePicker
          value={dayjs(orderData?.plannedEndingDate)}
          onChange={(value: Dayjs | null) => {
            console.log(value);
          }}
        />
      </div>

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
      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        size="medium"
        disabled={!formik.isValid || !formik.dirty}
      >
        {t('save-changes')}
      </Button>
    </Styled.OrderInfoFormContainer>
  );
};

export default OrderInfoForm;

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
import * as Yup from 'yup';

const initialOrderData: Order = {
  id: 0,
  trackingId: '',
  name: '',
  description: '',
  status: 'DESIGN',
  executionStatus: 'ACTIVE',
  statusHistory: [],
  postalService: '',
  postalCode: '',
  plannedEndingDate: '',
  amountLeftToPay: 0,
  legalEntity: false,
  acquisitionCost: 0,
  salePrice: 0,
  amountPaid: 0,
  payments: [],
  pausingComment: '',
};

const OrderInfoForm = () => {
  const { t } = useTranslation();
  const { selectedOrder, setSelectedOrder, updateOrderInOverviewList } =
    useContext(OrdersContext);

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

  const onSubmit = useCallback(
    async (values: Order) => {
      setSelectedOrder(null);
      try {
        const res: Order = await orderService.updateOrder(values);
        updateOrderInOverviewList(res);
        setSelectedOrder(res);
      } catch (error) {
        console.error(error);
      }
    },
    [setSelectedOrder, updateOrderInOverviewList]
  );

  const formik = useFormik<Order>({
    initialValues: selectedOrder ?? initialOrderData,
    validationSchema,
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
        error={!!formik.errors.name}
        helperText={formik.errors.name ?? ''}
        multiline
        maxRows={4}
      />
      <TextField
        className="order-description-input"
        label={t('description')}
        name="description"
        type="text"
        value={formik.values.description}
        error={!!formik.errors.description}
        helperText={formik.errors.description ?? ''}
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
        error={!!formik.errors.salePrice}
        helperText={formik.errors.salePrice ?? ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <TextField
        className="order-acquisition-cost-input"
        label={t('acquisition-cost')}
        type="number"
        name="acquisitionCost"
        value={formik.values.acquisitionCost}
        error={!!formik.errors.acquisitionCost}
        helperText={formik.errors.acquisitionCost ?? ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <dl className="order-const-difference">
        <dt>{t('price-difference')}</dt>
        <dd>{formik.values.salePrice - formik.values.acquisitionCost}</dd>
        <dt>{t('paid')}</dt>
        <dd>{selectedOrder?.amountPaid}</dd>
        <dt>{t('left-to-pay')}</dt>
        <dd>{selectedOrder?.amountLeftToPay}</dd>
      </dl>
      <div
        className="date-input-container"
        style={{ display: 'flex', gap: '16px', alignItems: 'end' }}
      >
        <p>{t('expected')}</p>
        <BasicDatePicker
          value={dayjs(selectedOrder?.plannedEndingDate)}
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

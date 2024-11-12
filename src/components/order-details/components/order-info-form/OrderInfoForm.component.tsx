import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { Dayjs } from 'dayjs';
import { FormikHelpers, useFormik } from 'formik';
import { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { BasicDatePicker } from '../../..';
import { orderService } from '../../../../api';
import OrdersContext from '../../../../store/OrdersProvider/Orders.context';
import { Order } from '../../../../types/Order';
import * as Styled from './OrderInfoForm.styles';
import dayjs from 'dayjs'; // Import dayjs

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
  plannedEndingDate: dayjs().add(1, 'week'),
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
    async (values: Order, { resetForm }: FormikHelpers<Order>) => {
      try {
        const res: Order = await orderService.updateOrder({
          ...values,
          plannedEndingDate: dayjs(values.plannedEndingDate).format(
            'YYYY-MM-DD'
          ),
        });
        updateOrderInOverviewList(res);
        setSelectedOrder(res);
        resetForm({
          values,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [setSelectedOrder, updateOrderInOverviewList]
  );

  const initialValues = useMemo(
    () =>
      selectedOrder
        ? {
            ...selectedOrder,
            plannedEndingDate: selectedOrder?.plannedEndingDate
              ? dayjs(selectedOrder.plannedEndingDate)
              : dayjs(),
          }
        : initialOrderData,
    [selectedOrder]
  );

  const formik = useFormik<Order>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const handleDateChange = useCallback(
    (newValue: Dayjs | null) => {
      if (newValue) {
        formik.setFieldValue('plannedEndingDate', newValue);
      }
    },
    [formik]
  );

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
        <dt>{t('sale-price-taxed')}</dt>
        <dd>
          {selectedOrder?.legalEntity ? selectedOrder?.salePriceWithTax : '-'}
        </dd>
        <dt>{t('price-difference')}</dt>
        <dd>{formik.values.priceDifference}</dd>
        <dt>{t('paid')}</dt>
        <dd>{selectedOrder?.amountPaid}</dd>
        <dt>{t('left-to-pay')}</dt>
        <dd>{selectedOrder?.amountLeftToPay}</dd>
      </dl>
      <BasicDatePicker
        label={t('expected')}
        value={formik.values.plannedEndingDate as Dayjs}
        onChange={handleDateChange}
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

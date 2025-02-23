import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Rating,
  TextField,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { FormikHelpers, useFormik } from 'formik';
import { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { BasicDatePicker } from '../../..';
import { orderService } from '../../../../api';
import OrdersContext from '../../../../store/OrdersProvider/Orders.context';
import {
  Order,
  orderPriorityArray,
  OrderPriorityEnum,
} from '../../../../types/Order';
import * as Styled from './OrderInfoForm.styles';

const initialOrderData: Order = {
  id: 0,
  trackingId: '',
  name: '',
  description: '',
  note: '',
  status: 'DESIGN',
  executionStatus: 'ACTIVE',
  priority: OrderPriorityEnum.MEDIUM,
  statusHistory: [],
  postalService: '',
  postalCode: '',
  plannedEndingDate: dayjs().add(1, 'week').format('DD.MM.YYYY'),
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
            plannedEndingDate: selectedOrder?.plannedEndingDate,
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
      className="order-info"
      autoComplete="off"
      onSubmit={formik.handleSubmit}
    >
      <div className="order-info__left">
        <TextField
          className="order-info__name"
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
          className="order-info__description"
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
          className="order-info__note"
          label={t('note')}
          name="note"
          type="text"
          value={formik.values.note}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.note}
          helperText={formik.errors.note ?? ''}
          multiline
          maxRows={4}
        />
        <BasicDatePicker
          label={t('expected')}
          value={formik.values.plannedEndingDate}
          disablePast
          onChange={handleDateChange}
        />
      </div>
      <div className="order-info__right">
        <TextField
          className="order-info__acquisition-cost"
          label={t('acquisition-cost')}
          type="number"
          name="acquisitionCost"
          value={formik.values.acquisitionCost}
          error={!!formik.errors.acquisitionCost}
          helperText={formik.errors.acquisitionCost ?? ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <TextField
          className="order-info__sale-price"
          label={t('sale-price')}
          type="number"
          name="salePrice"
          value={formik.values.salePrice}
          error={!!formik.errors.salePrice}
          helperText={formik.errors.salePrice ?? ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <dl className="order-info__calculations">
          {selectedOrder?.legalEntity && (
            <>
              <dt>{t('sale-price-taxed')}:</dt>
              <dd>{selectedOrder?.salePriceWithTax} RSD</dd>
            </>
          )}
          <dt>{t('price-difference')}:</dt>
          <dd>{selectedOrder?.priceDifference} RSD</dd>
          <dt>{t('paid')}:</dt>
          <dd>{selectedOrder?.amountPaid} RSD</dd>
          <dt>{t('left-to-pay')}:</dt>
          <dd>{selectedOrder?.amountLeftToPay} RSD</dd>
          <dt>{t('is-legal-entity')}:</dt>
          <dd>
            <FormControlLabel
              label=""
              className="order-info__is-legal"
              control={
                <Checkbox
                  name="legalEntity"
                  checked={formik.values.legalEntity}
                  onChange={formik.handleChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
            />
          </dd>
          <dt>{t('priority')}</dt>
          <dd>
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
          </dd>
        </dl>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          size="medium"
          className="order-info__save-changes"
          disabled={!formik.isValid || !formik.dirty}
        >
          {t('save-changes')}
          <SaveOutlinedIcon />
        </Button>
      </div>
    </Styled.OrderInfoFormContainer>
  );
};

export default OrderInfoForm;

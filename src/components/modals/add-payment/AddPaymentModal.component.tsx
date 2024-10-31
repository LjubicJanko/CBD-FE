import { Button, MenuItem, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import React, { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import orders from '../../../api/services/orders';
import OrdersContext from '../../../store/OrdersProvider/Orders.context';
import { Payment } from '../../../types/Payment';
import * as Styled from './AddPaymentModal.styles';

type AddPaymentModalProps = {
  isOpen: boolean;
  orderId: number;
  onClose: () => void;
};

type PaymentData = {
  payer: string;
  amount: string;
  dateOfTransaction: string;
  paymentMethod: 'ACCOUNT' | 'CASH' | 'INVOICE';
  note: string;
};

const paymentMethods = ['ACCOUNT', 'CASH', 'INVOICE'];

const initialValues: PaymentData = {
  payer: '',
  amount: '',
  dateOfTransaction: dayjs().format('YYYY-MM-DDTHH:mm'),
  paymentMethod: 'ACCOUNT',
  note: '',
};

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  isOpen,
  orderId,
  onClose,
}) => {
  const { t } = useTranslation();

  const { setIsOrderUpdating, updateOrderInOverviewList, setSelectedOrder } =
    useContext(OrdersContext);

  const validationSchema = Yup.object({
    payer: Yup.string().required(t('required')),
    amount: Yup.number().required(t('required')).positive(t('mustBePositive')),
    dateOfTransaction: Yup.string().required(t('required')),
    paymentMethod: Yup.string().required(t('required')),
    note: Yup.string(),
  });

  const onSubmit = useCallback(
    async (values: PaymentData) => {
      const newPayment: Payment = {
        id: Date.now(),
        payer: values.payer,
        amount: parseFloat(values.amount),
        dateOfTransaction: dayjs(values.dateOfTransaction),
        paymentMethod: values.paymentMethod,
        note: values.note,
      };
      try {
        setIsOrderUpdating(true);
        const order = await orders.addPayment(newPayment, orderId);
        updateOrderInOverviewList(order);
        setSelectedOrder(order);
      } catch (err) {
        console.error(err);
      } finally {
        setIsOrderUpdating(false);
      }
      onClose();
    },
    [
      onClose,
      setIsOrderUpdating,
      orderId,
      updateOrderInOverviewList,
      setSelectedOrder,
    ]
  );

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const isSubmitDisabled = useMemo(
    () => !formik.isValid || !formik.dirty,
    [formik.isValid, formik.dirty]
  );

  return (
    <Styled.AddPaymentModalContainer
      title={t('add-payment')}
      isOpen={isOpen}
      onClose={() => {
        formik.resetForm();
        onClose();
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="dense"
          label={t('payer')}
          name="payer"
          value={formik.values.payer}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.payer && Boolean(formik.errors.payer)}
          helperText={formik.touched.payer && formik.errors.payer}
        />
        <TextField
          fullWidth
          margin="dense"
          label={t('amount')}
          name="amount"
          type="number"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.amount && Boolean(formik.errors.amount)}
          helperText={formik.touched.amount && formik.errors.amount}
        />
        <TextField
          fullWidth
          margin="dense"
          select
          label={t('payment-method')}
          name="paymentMethod"
          value={formik.values.paymentMethod}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.paymentMethod && Boolean(formik.errors.paymentMethod)
          }
          helperText={
            formik.touched.paymentMethod && formik.errors.paymentMethod
          }
        >
          {paymentMethods.map((method) => (
            <MenuItem key={method} value={method}>
              {t(method)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          margin="dense"
          label={t('transaction-date')}
          name="dateOfTransaction"
          type="datetime-local"
          value={formik.values.dateOfTransaction}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.dateOfTransaction &&
            Boolean(formik.errors.dateOfTransaction)
          }
          helperText={
            formik.touched.dateOfTransaction && formik.errors.dateOfTransaction
          }
        />
        <TextField
          fullWidth
          margin="dense"
          multiline
          rows={4}
          maxRows={4}
          label={t('note')}
          name="note"
          value={formik.values.note}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.note && Boolean(formik.errors.note)}
          helperText={formik.touched.note && formik.errors.note}
        />
        <Button
          color="primary"
          fullWidth
          variant="contained"
          type="submit"
          disabled={isSubmitDisabled}
        >
          {t('add')}
        </Button>
      </form>
    </Styled.AddPaymentModalContainer>
  );
};

export default AddPaymentModal;

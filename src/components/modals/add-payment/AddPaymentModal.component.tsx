import { Button, MenuItem, TextField } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { FormikHelpers, useFormik } from 'formik';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import orders from '../../../api/services/orders';
import OrdersContext from '../../../store/OrdersProvider/Orders.context';
import { Payment } from '../../../types/Payment';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Styled from './AddPaymentModal.styles';
import { BasicDatePicker } from '../..';
import ConfirmModal, {
  ConfirmModalProps,
} from '../confirm-modal/ConfirmModal.component';

type AddPaymentModalProps = {
  isOpen: boolean;
  orderId: number;
  paymentToUpdate: Payment | undefined;
  onClose: () => void;
};

type PaymentData = {
  payer: string;
  amount: string;
  paymentDate: Dayjs | string;
  paymentMethod: 'ACCOUNT' | 'CASH' | 'INVOICE';
  note: string;
};

const paymentMethods = ['ACCOUNT', 'CASH', 'INVOICE'];

const EMPTY_CONFIRM_MODAL: ConfirmModalProps = {
  isOpen: false,
  text: '',
  hideNote: false,
  onConfirm: () => {},
  onCancel: () => {},
};

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  isOpen,
  orderId,
  paymentToUpdate,
  onClose,
}) => {
  const { t } = useTranslation();

  const { updateOrderInOverviewList, setSelectedOrder } =
    useContext(OrdersContext);

  const isUpdating = Boolean(paymentToUpdate);
  const [confirmModalProps, setConfirmModalProps] =
    useState(EMPTY_CONFIRM_MODAL);

  const initialValues: PaymentData = useMemo(
    () => ({
      payer: paymentToUpdate?.payer ?? '',
      amount: paymentToUpdate?.amount.toString() ?? '',
      paymentDate: paymentToUpdate
        ? dayjs(paymentToUpdate?.paymentDate)
        : dayjs(),
      paymentMethod: paymentToUpdate?.paymentMethod ?? 'ACCOUNT',
      note: paymentToUpdate?.note ?? '',
    }),
    [paymentToUpdate]
  );

  const validationSchema = Yup.object({
    payer: Yup.string().required(t('required')),
    amount: Yup.number()
      .required(t('required'))
      .positive(t('must-be-positive')),
    paymentDate: Yup.string().required(t('required')),
    paymentMethod: Yup.string().required(t('required')),
    note: Yup.string(),
  });

  const onSubmit = useCallback(
    async (values: PaymentData, { resetForm }: FormikHelpers<PaymentData>) => {
      const newPayment: Payment = {
        id: paymentToUpdate?.id ?? Date.now(),
        payer: values.payer,
        amount: parseFloat(values.amount),
        paymentDate: dayjs(values.paymentDate),
        paymentMethod: values.paymentMethod,
        note: values.note,
      };
      try {
        let order;
        if (paymentToUpdate) {
          order = await orders.editPayment(newPayment, orderId);
        } else {
          order = await orders.addPayment(newPayment, orderId);
        }
        updateOrderInOverviewList(order);
        setSelectedOrder(order);
        resetForm();
      } catch (err) {
        console.error(err);
      }
      onClose();
    },
    [
      paymentToUpdate,
      onClose,
      updateOrderInOverviewList,
      setSelectedOrder,
      orderId,
    ]
  );

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const handleDateChange = useCallback(
    (newValue: Dayjs | null) => {
      if (newValue) {
        formik.setFieldValue('paymentDate', newValue);
      }
    },
    [formik]
  );

  const handleDeletePayment = useCallback(async () => {
    try {
      if (!paymentToUpdate) return;

      const order = await orders.deletePayment(orderId, paymentToUpdate?.id);
      updateOrderInOverviewList(order);
      setSelectedOrder(order);
      onClose();
    } catch (error) {
      console.error(error);
    }
    setConfirmModalProps(EMPTY_CONFIRM_MODAL);
  }, [
    onClose,
    orderId,
    paymentToUpdate,
    setSelectedOrder,
    updateOrderInOverviewList,
  ]);

  const openConfirmModal = useCallback(() => {
    setConfirmModalProps({
      isOpen: true,
      text: t('delete-confirm'),
      hideNote: true,
      onConfirm: handleDeletePayment,
      onCancel: () => setConfirmModalProps(EMPTY_CONFIRM_MODAL),
    });
  }, [handleDeletePayment, t]);

  const isSubmitDisabled = useMemo(
    () => !formik.isValid || !formik.dirty,
    [formik.isValid, formik.dirty]
  );

  return (
    <>
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
              formik.touched.paymentMethod &&
              Boolean(formik.errors.paymentMethod)
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

          <BasicDatePicker
            label={t('transaction-date')}
            onChange={handleDateChange}
            value={formik.values.paymentDate as Dayjs}
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
          <div className="actions">
            <Button
              color="primary"
              fullWidth
              variant="contained"
              type="submit"
              disabled={isSubmitDisabled}
            >
              {t(isUpdating ? 'update' : 'add')}
            </Button>
            {isUpdating && (
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={() => openConfirmModal()}
              >
                {t('delete')}
                {<DeleteIcon />}
              </Button>
            )}
          </div>
        </form>
      </Styled.AddPaymentModalContainer>
      <ConfirmModal {...confirmModalProps} />
    </>
  );
};

export default AddPaymentModal;

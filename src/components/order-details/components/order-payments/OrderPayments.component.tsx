import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import orders from '../../../../api/services/orders';
import { usePrivileges } from '../../../../hooks/usePrivileges';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import OrdersContext from '../../../../store/OrdersProvider/Orders.context';
import { Payment } from '../../../../types/Payment';
import AddPaymentModal from '../../../modals/add-payment/AddPaymentModal.component';
import ConfirmModal from '../../../modals/confirm-modal/ConfirmModal.component';
import * as Styled from './OrderPayments.styles';

export type OrderPaymentsProps = {
  orderId: number;
  payments?: Payment[] | null;
  isAddingDisabled?: boolean;
};

type PaymentModalConfig = {
  isOpen: boolean;
  paymentToUpdate: Payment | undefined;
};

const initialPaymentModalConfig: PaymentModalConfig = {
  isOpen: false,
  paymentToUpdate: undefined,
};

const sortPayments = (payments: Payment[]) =>
  [...payments].sort(
    (a, b) =>
      dayjs(b.paymentDate).valueOf() - dayjs(a.paymentDate).valueOf() ||
      b.id - a.id
  );

const OrderPayments = ({
  orderId,
  payments,
  isAddingDisabled = false,
}: OrderPaymentsProps) => {
  const { t } = useTranslation();

  const privileges = usePrivileges();

  const { showSnackbar } = useSnackbar();

  const { updatePaymentInOverview, fetchSelectedOrderPayments } =
    useContext(OrdersContext);

  const sortedPayments = useMemo(
    () => sortPayments(payments ?? []),
    [payments]
  );

  const hasPaymentsRef = useRef(Boolean(payments));
  hasPaymentsRef.current = Boolean(payments);

  useEffect(() => {
    fetchSelectedOrderPayments(orderId).catch((error) => {
      console.error(error);
      if (!hasPaymentsRef.current) {
        showSnackbar(t('payments-load-failed'), 'error');
      }
    });
    // Refetch only when the tab opens or the order changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const [paymentModalConfig, setPaymentModalConfig] =
    useState<PaymentModalConfig>(initialPaymentModalConfig);

  const [confirmModalConfig, setConfirmModalConfig] =
    useState<PaymentModalConfig>(initialPaymentModalConfig);

  const handleOpenModal = useCallback(
    (paymentToUpdate?: Payment) =>
      setPaymentModalConfig({
        isOpen: true,
        paymentToUpdate: paymentToUpdate,
      }),
    []
  );

  const handleCloseModal = useCallback(() => {
    setPaymentModalConfig(initialPaymentModalConfig);
  }, []);

  const handleDeletePayment = useCallback(async () => {
    try {
      if (!confirmModalConfig?.paymentToUpdate) return;

      const updatePaymentsResponse = await orders.deletePayment(
        orderId,
        confirmModalConfig?.paymentToUpdate?.id
      );
      updatePaymentInOverview(orderId, updatePaymentsResponse);
    } catch (error) {
      console.error(error);
      showSnackbar(t('payment-delete-failed'), 'error');
    }
    setConfirmModalConfig(initialPaymentModalConfig);
  }, [
    confirmModalConfig?.paymentToUpdate,
    orderId,
    updatePaymentInOverview,
    showSnackbar,
    t,
  ]);

  return (
    <Styled.OrderPaymentsContainer className="order-payments">
      <div className="order-payments__data">
        {sortedPayments.length > 0 && (
          <Table className="order-payments__table" aria-label="payments table">
            <TableHead className="order-payments__table-header">
              <TableRow>
                <TableCell className="order-payments__header-cell">
                  {t('payer')}
                </TableCell>
                <TableCell className="order-payments__header-cell">
                  {t('amount')}
                </TableCell>
                <TableCell className="order-payments__header-cell">
                  {t('payment-method')}
                </TableCell>
                <TableCell className="order-payments__header-cell">
                  {t('transaction-date')}
                </TableCell>
                <TableCell className="order-payments__header-cell">
                  {t('note')}
                </TableCell>
                {!isAddingDisabled && (
                  <TableCell className="order-payments__header-cell"></TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPayments.map((payment) => (
                <TableRow
                  key={payment.id}
                  className="order-payments__row"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    className="order-payments__cell order-payments__cell--payer"
                    component="th"
                    scope="row"
                    data-label={t('payer')}
                  >
                    {payment.payer}
                  </TableCell>
                  <TableCell data-label={t('amount')} className="order-payments__cell order-payments__cell--amount">
                    {payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell data-label={t('payment-method')} className="order-payments__cell order-payments__cell--method">
                    {t(payment.paymentMethod)}
                  </TableCell>
                  <TableCell data-label={t('transaction-date')} className="order-payments__cell order-payments__cell--date">
                    {dayjs(payment.paymentDate).format('DD.MM.YYYY')}
                  </TableCell>
                  <TableCell data-label={t('note')} className="order-payments__cell order-payments__cell--note">
                    {payment.note || '-'}
                  </TableCell>
                  {!isAddingDisabled && (
                    <TableCell className="order-payments__cell order-payments__cell--actions-cell">
                      <Button onClick={() => handleOpenModal(payment)}>
                        <EditIcon />
                      </Button>
                      <Button
                        onClick={() =>
                          setConfirmModalConfig({
                            isOpen: true,
                            paymentToUpdate: payment,
                          })
                        }
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {sortedPayments.length === 0 && (
          <img
            className="order-payments__no-content"
            src="/no_content.png"
            alt="no-content"
          />
        )}
      </div>
      {privileges.canAddPayment && !isAddingDisabled && (
        <div className="order-payments__actions">
          <Button
            className="order-payments__actions__add-button"
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal()}
          >
            {t('add-payment')}
            <PaidOutlinedIcon />
          </Button>
        </div>
      )}
      <AddPaymentModal
        isOpen={paymentModalConfig.isOpen}
        orderId={orderId}
        onClose={handleCloseModal}
        paymentToUpdate={paymentModalConfig.paymentToUpdate}
      />
      <ConfirmModal
        text={t('delete-payment-confirm')}
        hideNote
        isOpen={confirmModalConfig.isOpen}
        onConfirm={handleDeletePayment}
        onCancel={() => setConfirmModalConfig(initialPaymentModalConfig)}
      />
    </Styled.OrderPaymentsContainer>
  );
};
export default OrderPayments;

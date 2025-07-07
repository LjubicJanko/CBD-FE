import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import orders from '../../../../api/services/orders';
import { usePrivileges } from '../../../../hooks/usePrivileges';
import OrdersContext from '../../../../store/OrdersProvider/Orders.context';
import { Payment } from '../../../../types/Payment';
import AddPaymentModal from '../../../modals/add-payment/AddPaymentModal.component';
import ConfirmModal from '../../../modals/confirm-modal/ConfirmModal.component';
import * as Styled from './OrderPayments.styles';

export type OrderPaymentsProps = {
  orderId: number;
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

const OrderPayments = ({
  orderId,
  isAddingDisabled = false,
}: OrderPaymentsProps) => {
  const { t } = useTranslation();

  const privileges = usePrivileges();

  const {
    payments,
    arePaymentsLoading,
    fetchPayments,
    updatePaymentInOverview,
  } = useContext(OrdersContext);

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
      updatePaymentInOverview(updatePaymentsResponse);
    } catch (error) {
      console.error(error);
    }
    setConfirmModalConfig(initialPaymentModalConfig);
  }, [confirmModalConfig?.paymentToUpdate, orderId, updatePaymentInOverview]);

  useEffect(() => {
    fetchPayments(orderId);
  }, [fetchPayments, orderId]);

  if (arePaymentsLoading) {
    return (
      <div className="loader-wrapper">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Styled.OrderPaymentsContainer className="order-payments">
      <div className="order-payments__data">
        {payments?.length > 0 && (
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
                  <>
                    <TableCell className="order-payments__header-cell"></TableCell>
                    <TableCell className="order-payments__header-cell"></TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow
                  key={payment.id}
                  className="order-payments__row"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    className="order-payments__cell order-payments__cell--payer"
                    component="th"
                    scope="row"
                  >
                    {payment.payer}
                  </TableCell>
                  <TableCell className="order-payments__cell order-payments__cell--amount">
                    {payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="order-payments__cell order-payments__cell--method">
                    {t(payment.paymentMethod)}
                  </TableCell>
                  <TableCell className="order-payments__cell order-payments__cell--date">
                    {payment.paymentDate.toString()}
                  </TableCell>
                  <TableCell className="order-payments__cell order-payments__cell--note">
                    {payment.note || '-'}
                  </TableCell>
                  {!isAddingDisabled && (
                    <>
                      <TableCell className="order-payments__cell order-payments__cell--edit">
                        <Button onClick={() => handleOpenModal(payment)}>
                          <EditIcon />
                        </Button>
                      </TableCell>
                      <TableCell className="order-payments__cell order-payments__cell--delete">
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
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {payments?.length === 0 && (
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

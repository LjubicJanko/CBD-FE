import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Payment } from '../../../../types/Payment';
import AddPaymentModal from '../../../modals/add-payment/AddPaymentModal.component';
import * as Styled from './OrderPayments.styles';
import { usePrivileges } from '../../../../hooks/usePrivileges';
import EditIcon from '@mui/icons-material/Edit';

export type OrderPaymentsProps = {
  payments: Payment[];
  orderId: number;
  isAddingDisabled?: boolean;
};

type PaymentModalConfig = {
  isOpen: boolean;
  paymentToUpdate: Payment | undefined;
};
const initialPaymentModalConfig = {
  isOpen: false,
  paymentToUpdate: undefined,
};

const OrderPayments = ({
  payments,
  orderId,
  isAddingDisabled = false,
}: OrderPaymentsProps) => {
  const { t } = useTranslation();
  const privileges = usePrivileges();

  const [paymentModalConfig, setPaymentModalConfig] =
    useState<PaymentModalConfig>(initialPaymentModalConfig);

  const handleOpenModal = useCallback(
    (paymentToUpdate?: Payment) =>
      setPaymentModalConfig({
        isOpen: true,
        paymentToUpdate: paymentToUpdate,
      }),
    []
  );

  const handleCloseModal = useCallback(
    () => setPaymentModalConfig(initialPaymentModalConfig),
    []
  );

  return (
    <Styled.OrderPaymentsContainer>
      <h2>{t('payments')}</h2>
      <AddPaymentModal
        isOpen={paymentModalConfig.isOpen}
        orderId={orderId}
        onClose={handleCloseModal}
        paymentToUpdate={paymentModalConfig.paymentToUpdate}
      />

      {payments.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="payments table">
            <TableHead>
              <TableRow>
                <TableCell>{t('payer')}</TableCell>
                <TableCell align="right">{t('amount')}</TableCell>
                <TableCell align="right">{t('payment-method')}</TableCell>
                <TableCell align="right">{t('transaction-date')}</TableCell>
                <TableCell align="right">{t('note')}</TableCell>
                {!isAddingDisabled && <TableCell align="right"></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow
                  key={payment.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {payment.payer}
                  </TableCell>
                  <TableCell align="right">
                    {payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={t(payment.paymentMethod)}
                      className="payment-method-chip"
                      style={{
                        backgroundColor:
                          payment.paymentMethod === 'CASH'
                            ? 'green'
                            : payment.paymentMethod === 'ACCOUNT'
                            ? 'blue'
                            : 'orange',
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {payment.paymentDate.toString()}
                  </TableCell>
                  <TableCell align="right">{payment.note || '-'}</TableCell>
                  {!isAddingDisabled && (
                    <TableCell align="right" className="edit">
                      <Button onClick={() => handleOpenModal(payment)}>
                        <EditIcon />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {payments.length === 0 && (
        <img className="no-content" src="/no_content.png" alt="no-content" />
      )}

      {privileges.canAddPayment && !isAddingDisabled && (
        <div className="actions">
          <Button
            className="add-button"
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal()}
          >
            {t('add-payment')}
            <AddIcon />
          </Button>
        </div>
      )}
    </Styled.OrderPaymentsContainer>
  );
};

export default OrderPayments;

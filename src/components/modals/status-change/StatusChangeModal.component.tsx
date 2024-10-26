import { useFormik } from 'formik';
import * as Styled from './StatusChangeModal.styles';
import { useCallback } from 'react';
import { Button, TextField } from '@mui/material';
import { Order, OrderStatus } from '../../../types/Order';
import { getNextStatus } from '../../../util/util';
import { orderService } from '../../../api';
import { useTranslation } from 'react-i18next';

export type StatusChangeModalProps = {
  currentStatus: OrderStatus;
  isOpen?: boolean;
  orderId: number;
  setOrderData: React.Dispatch<React.SetStateAction<Order>>;
  onClose: () => void;
};

export type StatusData = {
  closingComment?: string;
  postalCode?: string;
  postalService?: string;
};

const StatusChangeModal = ({
  currentStatus,
  isOpen = false,
  orderId,
  setOrderData,
  onClose,
}: StatusChangeModalProps) => {
  const { t } = useTranslation();
  const initialValues = {};
  const nextStatus = getNextStatus(currentStatus);

  const onSubmit = useCallback(
    async (statusData: StatusData) => {
      try {
        const response: Order = await orderService.changeStatus(
          orderId,
          statusData
        );
        setOrderData(response);
        console.log(response);
      } catch (error) {
        console.error(error);
      } finally {
        onClose();
      }
    },
    [onClose, orderId, setOrderData]
  );

  const formik = useFormik<StatusData>({
    initialValues,
    onSubmit,
  });

  return (
    <Styled.StatusChangeModalContainer
      title={t('move-to-next-state')}
      isOpen={isOpen}
      onClose={() => {
        formik.resetForm();
        onClose();
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="fields">
          <TextField
            className="comment-input"
            label={t('comment')}
            name="closingComment"
            type="text"
            value={formik.values.closingComment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            multiline
            maxRows={4}
          />
          {currentStatus === 'SHIP_READY' && (
            <>
              <TextField
                className="postal-service-input"
                label={t('postal-service')}
                name="postalService"
                type="text"
                value={formik.values.postalService}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <TextField
                className="postal-code-input"
                label={t('postal-code')}
                name="postalCode"
                type="text"
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </>
          )}
        </div>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="medium"
          type="submit"
          disabled={!formik.isValid}
          className="submit-button"
        >
          {t('move-to', { STATUS: t(nextStatus) })}
        </Button>
      </form>
    </Styled.StatusChangeModalContainer>
  );
};

export default StatusChangeModal;

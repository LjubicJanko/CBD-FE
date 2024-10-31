import CancelIcon from '@mui/icons-material/Cancel';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PauseIcon from '@mui/icons-material/Pause';
import { Button, Divider, IconButton } from '@mui/material';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { orderService } from '../../api';
import { usePrivileges } from '../../hooks/usePrivileges';
import OrdersContext from '../../store/OrdersProvider/Orders.context';
import {
  Order,
  OrderExecutionStatusEnum,
  OrderStatusEnum,
} from '../../types/Order';
import StatusChangeModal from '../modals/status-change/StatusChangeModal.component';
import * as Styled from './OrderDetails.styles';
import ChangeHistoryComponent from './components/ChangeHistory.component';
import OrderInfoForm from './components/order-info-form/OrderInfoForm.component';
import OrderInfoOverview from './components/order-info-overview/OrderInfoOverview.component';
import OrderPayments from './components/order-payments/OrderPayments.component';
import ConfirmModal from '../modals/confirm-modal/ConfirmModal.component';
import ReplayIcon from '@mui/icons-material/Replay';

export type OrderDetailsProps = {
  order?: Order;
};

export type ConfirmModalProps = {
  open: boolean;
  text: string;
  onConfirm: (note: string) => void;
  onCancel: () => void;
};

const initialData: Order = {
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
};

const EMPTY_CONFIRM_MODAL_PROPS: ConfirmModalProps = {
  open: false,
  text: '',
  onConfirm: () => {},
  onCancel: () => {},
};

const OrderDetailsComponent = ({ order }: OrderDetailsProps) => {
  const { t } = useTranslation();

  const { selectedOrder, isOrderUpdating, fetchOrders } =
    useContext(OrdersContext);

  const {
    canEditData,
    canCancelOrder,
    canPauseOrder,
    canMoveToPrintReady,
    canMoveToPrinting,
    canMoveToSewing,
    canMoveToShipReady,
    canMoveToShipped,
    canMoveToDone,
  } = usePrivileges();

  const [orderData, setOrderData] = useState(order || initialData);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [confirmModalProps, setConfirmModalProps] = useState<ConfirmModalProps>(
    EMPTY_CONFIRM_MODAL_PROPS
  );

  const isMoveButtonDisabled = useMemo(() => {
    switch (order?.status) {
      case OrderStatusEnum.DESIGN:
        return !canMoveToPrintReady;
      case OrderStatusEnum.PRINT_READY:
        return !canMoveToPrinting;
      case OrderStatusEnum.PRINTING:
        return !canMoveToSewing;
      case OrderStatusEnum.SEWING:
        return !canMoveToShipReady;
      case OrderStatusEnum.SHIP_READY:
        return !canMoveToShipped;
      case OrderStatusEnum.SHIPPED:
        return !canMoveToDone;
      case OrderStatusEnum.DONE:
        return true;
      default:
        return true;
    }
  }, [
    canMoveToPrintReady,
    canMoveToPrinting,
    canMoveToSewing,
    canMoveToShipReady,
    canMoveToShipped,
    canMoveToDone,
    order?.status,
  ]);

  const shouldShowPause = useMemo(
    () =>
      canPauseOrder &&
      order?.executionStatus === OrderExecutionStatusEnum.ACTIVE,
    [canPauseOrder, order?.executionStatus]
  );

  const shouldShowReactivate = useMemo(
    () =>
      canPauseOrder &&
      order?.executionStatus === OrderExecutionStatusEnum.PAUSED,
    [canPauseOrder, order?.executionStatus]
  );

  const shouldShowCancel = useMemo(
    () =>
      ['ACTIVE', 'PAUSED'].includes(
        order?.executionStatus as OrderExecutionStatusEnum
      ) && canCancelOrder,
    [canCancelOrder, order?.executionStatus]
  );

  const handleOpenStatusModal = useCallback(() => {
    setIsStatusModalOpen(true);
  }, []);

  const handleCloseStatusModal = useCallback(() => {
    setIsStatusModalOpen(false);
  }, []);

  const resetConfirmModalProps = useCallback(() => {
    setConfirmModalProps(EMPTY_CONFIRM_MODAL_PROPS);
  }, []);

  const handlePauseOrder = useCallback(
    async (note: string) => {
      if (!order?.id) return;

      try {
        const response: Order = await orderService.changeExecutionStatus(
          order?.id,
          OrderExecutionStatusEnum.PAUSED,
          note
        );

        console.log(response);
        fetchOrders();
      } catch (error) {
        console.error(error);
      }

      resetConfirmModalProps();
    },
    [fetchOrders, order?.id, resetConfirmModalProps]
  );

  const handleReactivateOrder = useCallback(
    async (note: string) => {
      if (!order?.id) return;

      try {
        const response: Order = await orderService.changeExecutionStatus(
          order?.id,
          OrderExecutionStatusEnum.ACTIVE,
          note
        );

        console.log(response);
        fetchOrders();
      } catch (error) {
        console.error(error);
      }

      resetConfirmModalProps();
    },
    [fetchOrders, order?.id, resetConfirmModalProps]
  );

  const handleCancelOrder = useCallback(
    async (note: string) => {
      if (!order?.id) return;

      try {
        const response: Order = await orderService.changeExecutionStatus(
          order?.id,
          OrderExecutionStatusEnum.CANCELED,
          note
        );

        console.log(response);
        fetchOrders();
      } catch (error) {
        console.error(error);
      }

      resetConfirmModalProps();
    },
    [fetchOrders, order?.id, resetConfirmModalProps]
  );

  const handleOpenPauseModal = useCallback(() => {
    setConfirmModalProps({
      open: true,
      text: t('pause-reason'),
      onConfirm: handlePauseOrder,
      onCancel: resetConfirmModalProps,
    });
  }, [handlePauseOrder, resetConfirmModalProps, t]);

  const handleOpenReactivateModal = useCallback(() => {
    setConfirmModalProps({
      open: true,
      text: t('reactivate-reason'),
      onConfirm: handleReactivateOrder,
      onCancel: resetConfirmModalProps,
    });
  }, [handleReactivateOrder, resetConfirmModalProps, t]);

  const handleOpenCancelModal = useCallback(() => {
    setConfirmModalProps({
      open: true,
      text: t('cancel-reason'),
      onConfirm: handleCancelOrder,
      onCancel: resetConfirmModalProps,
    });
  }, [handleCancelOrder, resetConfirmModalProps, t]);

  if (!orderData.id) return <></>;

  return (
    <Styled.OrderDetailsContainer
      key={isOrderUpdating ? selectedOrder?.id : selectedOrder?.name}
    >
      <div className="tracking-id">
        <p>{t('tracking-id', { TRACKING_ID: orderData.trackingId })}</p>
        <IconButton
          onClick={() => navigator.clipboard.writeText(orderData.trackingId)}
          edge="end"
        >
          <ContentCopyIcon />
        </IconButton>
      </div>
      <Divider />
      {canEditData && <OrderInfoForm orderData={orderData} />}
      {!canEditData && <OrderInfoOverview orderData={orderData} />}
      <Divider />
      <OrderPayments payments={orderData.payments} orderId={orderData.id} />
      <Divider />
      <ChangeHistoryComponent
        statusHistory={orderData.statusHistory}
        status={orderData.status}
      />
      {orderData.status !== OrderStatusEnum.DONE && (
        <>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="medium"
            disabled={isMoveButtonDisabled}
            onClick={handleOpenStatusModal}
          >
            {t('move-to-next-state')}
          </Button>
          <Divider />
          <div className="action-buttons">
            {shouldShowPause && (
              <Button
                variant="outlined"
                color="warning"
                className="pause-order"
                onClick={handleOpenPauseModal}
                size="large"
              >
                <p>{t('pause')}</p>
                <PauseIcon />
              </Button>
            )}
            {shouldShowReactivate && (
              <Button
                variant="outlined"
                color="success"
                className="reactivate-order"
                onClick={handleOpenReactivateModal}
                size="large"
              >
                <p>{t('reactivate')}</p>
                <ReplayIcon />
              </Button>
            )}
            {shouldShowCancel && (
              <Button
                variant="contained"
                color="error"
                className="cancel-order"
                onClick={handleOpenCancelModal}
              >
                <p>{t('cancel')}</p>
                <CancelIcon />
              </Button>
            )}
          </div>
        </>
      )}
      <StatusChangeModal
        key={`status-modal-${isStatusModalOpen}`}
        orderId={orderData.id}
        currentStatus={orderData.status}
        isOpen={isStatusModalOpen}
        onClose={handleCloseStatusModal}
        setOrderData={setOrderData}
      />
      <ConfirmModal
        text={confirmModalProps.text}
        isOpen={confirmModalProps.open}
        onConfirm={confirmModalProps.onConfirm}
        onCancel={confirmModalProps.onCancel}
      />
    </Styled.OrderDetailsContainer>
  );
};

export default OrderDetailsComponent;

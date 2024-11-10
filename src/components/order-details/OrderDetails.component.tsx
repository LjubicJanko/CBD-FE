import CancelIcon from '@mui/icons-material/Cancel';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import { Button, Chip, Divider, IconButton, Tooltip } from '@mui/material';
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
import ConfirmModal, {
  ConfirmModalProps,
} from '../modals/confirm-modal/ConfirmModal.component';
import StatusChangeModal from '../modals/status-change/StatusChangeModal.component';
import * as Styled from './OrderDetails.styles';
import ChangeHistoryComponent from './components/ChangeHistory.component';
import OrderInfoForm from './components/order-info-form/OrderInfoForm.component';
import OrderInfoOverview from './components/order-info-overview/OrderInfoOverview.component';
import OrderPayments from './components/order-payments/OrderPayments.component';

const EMPTY_CONFIRM_MODAL: ConfirmModalProps = {
  isOpen: false,
  text: '',
  hideNote: false,
  onConfirm: () => {},
  onCancel: () => {},
};

type ButtonColors =
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'info'
  | 'warning';

export type OrderDetailsProps = { order?: Order };

const OrderDetailsComponent = () => {
  const { t } = useTranslation();
  const { selectedOrder, fetchOrders, setSelectedOrder } =
    useContext(OrdersContext);
  const privileges = usePrivileges();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [confirmModalProps, setConfirmModalProps] =
    useState(EMPTY_CONFIRM_MODAL);

  const isPaused = useMemo(
    () => selectedOrder?.executionStatus === OrderExecutionStatusEnum.PAUSED,
    [selectedOrder?.executionStatus]
  );

  const isCanceled =
    selectedOrder?.executionStatus === OrderExecutionStatusEnum.CANCELED;

  const canArchive = useMemo(
    () =>
      selectedOrder?.status === OrderStatusEnum.DONE &&
      selectedOrder.executionStatus !== OrderExecutionStatusEnum.ARCHIVED &&
      selectedOrder.executionStatus !== OrderExecutionStatusEnum.CANCELED,
    [selectedOrder?.executionStatus, selectedOrder?.status]
  );

  const shouldShowForm = useMemo(
    () =>
      privileges.canEditData &&
      !isPaused &&
      selectedOrder?.executionStatus !== OrderExecutionStatusEnum.CANCELED &&
      selectedOrder?.status !== OrderStatusEnum.DONE,
    [
      isPaused,
      selectedOrder?.executionStatus,
      selectedOrder?.status,
      privileges.canEditData,
    ]
  );

  const isMoveButtonDisabled = useMemo(() => {
    const movePermissions = {
      DESIGN: privileges.canMoveToPrintReady,
      PRINT_READY: privileges.canMoveToPrinting,
      PRINTING: privileges.canMoveToSewing,
      SEWING: privileges.canMoveToShipReady,
      SHIP_READY: privileges.canMoveToShipped,
      SHIPPED: privileges.canMoveToDone,
      DONE: false,
    };
    return (
      !movePermissions[selectedOrder?.status as OrderStatusEnum] || isPaused
    );
  }, [
    isPaused,
    privileges.canMoveToDone,
    privileges.canMoveToPrintReady,
    privileges.canMoveToPrinting,
    privileges.canMoveToSewing,
    privileges.canMoveToShipReady,
    privileges.canMoveToShipped,
    selectedOrder?.status,
  ]);

  const nonActiveBanner = useMemo(
    () => (
      <Tooltip title={selectedOrder?.pausingComment}>
        <Chip
          className="execution-chip"
          label={isCanceled ? 'canceled' : 'paused'}
        />
      </Tooltip>
    ),
    [isCanceled, selectedOrder?.pausingComment]
  );

  const resetConfirmModal = useCallback(
    () => setConfirmModalProps(EMPTY_CONFIRM_MODAL),
    []
  );

  const openConfirmModal = useCallback(
    (text: string, onConfirm: (note: string) => void, hideNote?: boolean) => {
      setConfirmModalProps({
        isOpen: true,
        text,
        hideNote: hideNote,
        onConfirm,
        onCancel: resetConfirmModal,
      });
    },
    [resetConfirmModal]
  );

  const changeOrderStatus = useCallback(
    async (status: OrderExecutionStatusEnum, note: string) => {
      if (!selectedOrder?.id) return;
      try {
        const orderResponse = await orderService.changeExecutionStatus(
          selectedOrder.id,
          status,
          note
        );
        fetchOrders();
        setSelectedOrder(orderResponse);
      } catch (error) {
        console.error(error);
      }
      resetConfirmModal();
    },
    [fetchOrders, selectedOrder?.id, resetConfirmModal, setSelectedOrder]
  );

  const handleDeleteOrder = useCallback(async () => {
    if (!selectedOrder?.id) return;
    setSelectedOrder(null);
    try {
      await orderService.deleteOrder(selectedOrder.id);
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  }, [fetchOrders, selectedOrder?.id, setSelectedOrder]);

  const toggleStatusModal = useCallback(
    () => setIsStatusModalOpen((prev) => !prev),
    []
  );

  const actionButtons = useMemo(
    () => [
      {
        show:
          privileges.canPauseOrder &&
          selectedOrder?.executionStatus === OrderExecutionStatusEnum.ACTIVE,
        label: t('pause'),
        color: 'warning' as ButtonColors,
        icon: <PauseIcon />,
        onClick: () =>
          openConfirmModal(t('pause-reason'), (note: string) =>
            changeOrderStatus(OrderExecutionStatusEnum.PAUSED, note)
          ),
      },
      {
        show: privileges.canPauseOrder && isPaused,
        label: t('reactivate'),
        color: 'success' as ButtonColors,
        icon: <ReplayIcon />,
        onClick: () =>
          openConfirmModal(t('reactivate-reason'), (note: string) =>
            changeOrderStatus(OrderExecutionStatusEnum.ACTIVE, note)
          ),
      },
      {
        show:
          privileges.canCancelOrder &&
          ['ACTIVE', 'PAUSED'].includes(selectedOrder?.executionStatus || ''),
        label: t('cancel'),
        color: 'error' as ButtonColors,
        icon: <CancelIcon />,
        onClick: () =>
          openConfirmModal(t('cancel-reason'), (note: string) =>
            changeOrderStatus(OrderExecutionStatusEnum.CANCELED, note)
          ),
      },
      {
        show: privileges.canCancelOrder,
        label: t('delete'),
        color: 'error' as ButtonColors,
        icon: <DeleteIcon />,
        onClick: () =>
          openConfirmModal(t('delete-confirm'), handleDeleteOrder, true),
      },
    ],
    [
      changeOrderStatus,
      handleDeleteOrder,
      isPaused,
      openConfirmModal,
      privileges.canCancelOrder,
      privileges.canPauseOrder,
      selectedOrder?.executionStatus,
      t,
    ]
  );

  if (!selectedOrder) return null;

  return (
    <Styled.OrderDetailsContainer key={selectedOrder?.id}>
      {(isCanceled || isPaused) && nonActiveBanner}
      {canArchive && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="medium"
          onClick={() =>
            openConfirmModal(t('archive-reason'), (note: string) =>
              changeOrderStatus(OrderExecutionStatusEnum.ARCHIVED, note)
            )
          }
        >
          {t('archive')}
        </Button>
      )}
      <div className="tracking-id">
        <p>{t('tracking-id', { TRACKING_ID: selectedOrder.trackingId })}</p>
        <IconButton
          onClick={() =>
            navigator.clipboard.writeText(selectedOrder.trackingId)
          }
          edge="end"
        >
          <ContentCopyIcon />
        </IconButton>
      </div>
      <Divider />
      {shouldShowForm ? (
        <OrderInfoForm />
      ) : (
        <OrderInfoOverview selectedOrder={selectedOrder} />
      )}
      <ChangeHistoryComponent
        statusHistory={selectedOrder.statusHistory}
        status={selectedOrder.status}
      />
      {selectedOrder.status !== OrderStatusEnum.DONE && (
        <>
          <Button
            key={isStatusModalOpen ? 'openned' : 'closed'}
            variant="contained"
            color="primary"
            fullWidth
            size="medium"
            disabled={isMoveButtonDisabled}
            onClick={toggleStatusModal}
          >
            {t('move-to-next-state')}
          </Button>
        </>
      )}
      <Divider />
      <OrderPayments
        payments={selectedOrder.payments}
        orderId={selectedOrder.id}
        isAddingDisabled={
          selectedOrder.executionStatus !== OrderExecutionStatusEnum.ACTIVE ||
          selectedOrder.status === OrderStatusEnum.DONE
        }
      />
      <Divider />
      {selectedOrder.status !== OrderStatusEnum.DONE && (
        <div className="action-buttons">
          {actionButtons.map(
            ({ show, label, color, icon, onClick }, index) =>
              show && (
                <Button
                  key={index}
                  variant="outlined"
                  color={color}
                  onClick={onClick}
                  size="large"
                >
                  <p>{label}</p>
                  {icon}
                </Button>
              )
          )}
        </div>
      )}
      {isStatusModalOpen && (
        <StatusChangeModal
          orderId={selectedOrder.id}
          currentStatus={selectedOrder.status}
          isOpen={isStatusModalOpen}
          onClose={toggleStatusModal}
        />
      )}
      <ConfirmModal {...confirmModalProps} />
    </Styled.OrderDetailsContainer>
  );
};

export default OrderDetailsComponent;

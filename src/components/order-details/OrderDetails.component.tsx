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
import dayjs from 'dayjs';

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
  const { selectedOrder, isOrderUpdating, fetchOrders, setSelectedOrder } =
    useContext(OrdersContext);
  const privileges = usePrivileges();

  const [orderData, setOrderData] = useState(selectedOrder || initialOrderData);
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
      orderData?.status === OrderStatusEnum.DONE &&
      orderData.executionStatus !== OrderExecutionStatusEnum.ARCHIVED &&
      orderData.executionStatus !== OrderExecutionStatusEnum.CANCELED,
    [orderData?.executionStatus, orderData?.status]
  );

  const shouldShowForm = useMemo(
    () =>
      privileges.canEditData &&
      !isPaused &&
      orderData.executionStatus !== OrderExecutionStatusEnum.CANCELED &&
      orderData.status !== OrderStatusEnum.DONE,
    [
      isPaused,
      orderData.executionStatus,
      orderData.status,
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
      <Tooltip title={orderData.pausingComment}>
        <Chip
          className="execution-chip"
          label={isCanceled ? 'canceled' : 'paused'}
        />
      </Tooltip>
    ),
    [isCanceled, orderData.pausingComment]
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
      setSelectedOrder(null);
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

  if (!orderData.id) return null;

  if (isOrderUpdating)
    return <Styled.OrderDetailsContainer>loading</Styled.OrderDetailsContainer>;

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
        <p>{t('tracking-id', { TRACKING_ID: orderData.trackingId })}</p>
        <IconButton
          onClick={() => navigator.clipboard.writeText(orderData.trackingId)}
          edge="end"
        >
          <ContentCopyIcon />
        </IconButton>
      </div>
      <Divider />
      {shouldShowForm ? (
        <OrderInfoForm />
      ) : (
        <OrderInfoOverview orderData={orderData} />
      )}
      <ChangeHistoryComponent
        statusHistory={orderData.statusHistory}
        status={orderData.status}
      />
      {orderData.status !== OrderStatusEnum.DONE && (
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
        payments={orderData.payments}
        orderId={orderData.id}
        isAddingDisabled={
          orderData.executionStatus !== OrderExecutionStatusEnum.ACTIVE ||
          orderData.status === OrderStatusEnum.DONE
        }
      />
      <Divider />
      {orderData.status !== OrderStatusEnum.DONE && (
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
          orderId={orderData.id}
          currentStatus={orderData.status}
          isOpen={isStatusModalOpen}
          onClose={toggleStatusModal}
          setOrderData={setOrderData}
        />
      )}
      <ConfirmModal {...confirmModalProps} />
    </Styled.OrderDetailsContainer>
  );
};

export default OrderDetailsComponent;

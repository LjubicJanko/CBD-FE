import CancelIcon from '@mui/icons-material/Cancel';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
import ConfirmModal from '../modals/confirm-modal/ConfirmModal.component';
import StatusChangeModal from '../modals/status-change/StatusChangeModal.component';
import * as Styled from './OrderDetails.styles';
import ChangeHistoryComponent from './components/ChangeHistory.component';
import OrderInfoForm from './components/order-info-form/OrderInfoForm.component';
import OrderInfoOverview from './components/order-info-overview/OrderInfoOverview.component';
import OrderPayments from './components/order-payments/OrderPayments.component';

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
  plannedEndingDate: '',
  amountLeftToPay: 0,
  legalEntity: false,
  acquisitionCost: 0,
  salePrice: 0,
  amountPaid: 0,
  payments: [],
  pausingComment: '',
};

type ConfirmModalProps = {
  open: boolean;
  text: string;
  onConfirm: (note: string) => void;
  onCancel: () => void;
};

const EMPTY_CONFIRM_MODAL: ConfirmModalProps = {
  open: false,
  text: '',
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

  console.log({ canArchive });

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

  const actionButtons = [
    {
      show:
        privileges.canPauseOrder &&
        selectedOrder?.executionStatus === OrderExecutionStatusEnum.ACTIVE,
      label: t('pause'),
      color: 'warning' as ButtonColors,
      icon: <PauseIcon />,
      onClick: () => openConfirmModal(t('pause-reason'), handlePauseOrder),
    },
    {
      show: privileges.canPauseOrder && isPaused,
      label: t('reactivate'),
      color: 'success' as ButtonColors,
      icon: <ReplayIcon />,
      onClick: () =>
        openConfirmModal(t('reactivate-reason'), handleReactivateOrder),
    },
    {
      show:
        privileges.canCancelOrder &&
        ['ACTIVE', 'PAUSED'].includes(selectedOrder?.executionStatus || ''),
      label: t('cancel'),
      color: 'error' as ButtonColors,
      icon: <CancelIcon />,
      onClick: () => openConfirmModal(t('cancel-reason'), handleCancelOrder),
    },
  ];

  const resetConfirmModal = useCallback(
    () => setConfirmModalProps(EMPTY_CONFIRM_MODAL),
    []
  );

  const openConfirmModal = useCallback(
    (text: string, onConfirm: (note: string) => void) => {
      setConfirmModalProps({
        open: true,
        text,
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

  const handlePauseOrder = (note: string) =>
    changeOrderStatus(OrderExecutionStatusEnum.PAUSED, note);
  const handleReactivateOrder = (note: string) =>
    changeOrderStatus(OrderExecutionStatusEnum.ACTIVE, note);
  const handleCancelOrder = (note: string) =>
    changeOrderStatus(OrderExecutionStatusEnum.CANCELED, note);
  const handleArchiveOrder = useCallback(
    (note: string) =>
      changeOrderStatus(OrderExecutionStatusEnum.ARCHIVED, note),
    [changeOrderStatus]
  );

  const toggleStatusModal = useCallback(
    () => setIsStatusModalOpen((prev) => !prev),
    []
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
            openConfirmModal(t('archive-reason'), handleArchiveOrder)
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

      <StatusChangeModal
        orderId={orderData.id}
        currentStatus={orderData.status}
        isOpen={isStatusModalOpen}
        onClose={toggleStatusModal}
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

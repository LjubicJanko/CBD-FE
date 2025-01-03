import CancelIcon from '@mui/icons-material/Cancel';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import {
  Button,
  Chip,
  Divider,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
} from '@mui/material';
import classNames from 'classnames';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { orderService } from '../../api';
import { usePrivileges } from '../../hooks/usePrivileges';
import useResponsiveWidth from '../../hooks/useResponsiveWidth';
import { useSnackbar } from '../../hooks/useSnackbar';
import AuthContext from '../../store/AuthProvider/Auth.context';
import OrdersContext from '../../store/OrdersProvider/Orders.context';
import {
  Order,
  OrderExecutionStatusEnum,
  OrderStatusEnum,
} from '../../types/Order';
import { xxsMax } from '../../util/breakpoints';
import { statuses } from '../../util/util';
import ConfirmModal, {
  ConfirmModalProps,
} from '../modals/confirm-modal/ConfirmModal.component';
import StatusChangeModal from '../modals/status-change/StatusChangeModal.component';
import StatusHistoryModal from '../modals/status-history/StatusHistoryModal.component';
import * as Styled from './OrderDetails.styles';
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
  const {
    selectedOrder,
    setSelectedOrder,
    updateOrderInOverviewList,
    removeOrderInOverviewList,
  } = useContext(OrdersContext);

  const privileges = usePrivileges();

  const width = useResponsiveWidth();

  const { authData } = useContext(AuthContext);

  const { showSnackbar } = useSnackbar();

  const { roles: userRoles } = authData ?? {};

  const isAdmin = userRoles?.includes('admin');

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isStatusHistoryModalOpen, setIsStatusHistoryModalOpen] =
    useState(false);
  const [confirmModalProps, setConfirmModalProps] =
    useState(EMPTY_CONFIRM_MODAL);

  const isPaused = useMemo(
    () => selectedOrder?.executionStatus === OrderExecutionStatusEnum.PAUSED,
    [selectedOrder?.executionStatus]
  );

  const isCanceled = useMemo(
    () => selectedOrder?.executionStatus === OrderExecutionStatusEnum.CANCELED,
    [selectedOrder?.executionStatus]
  );

  const canArchive = useMemo(
    () =>
      isAdmin &&
      selectedOrder?.status === OrderStatusEnum.DONE &&
      selectedOrder.executionStatus !== OrderExecutionStatusEnum.ARCHIVED &&
      selectedOrder.executionStatus !== OrderExecutionStatusEnum.CANCELED,
    [isAdmin, selectedOrder?.executionStatus, selectedOrder?.status]
  );

  const isArchived = useMemo(
    () =>
      selectedOrder?.executionStatus === OrderExecutionStatusEnum.ARCHIVED ||
      selectedOrder?.executionStatus === OrderExecutionStatusEnum.CANCELED,
    [selectedOrder?.executionStatus]
  );

  const shouldShowForm = useMemo(
    () => privileges.canEditData && !isPaused && !isArchived,
    [privileges.canEditData, isPaused, isArchived]
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
          className={classNames('execution-chip', {
            'execution-chip--canceled': isCanceled,
          })}
          label={(isCanceled ? t('canceled') : t('paused')).toUpperCase()}
        />
      </Tooltip>
    ),
    [isCanceled, selectedOrder?.pausingComment, t]
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
      if (!selectedOrder || !selectedOrder?.id) return;
      try {
        const orderResponse = await orderService.changeExecutionStatus(
          selectedOrder.id,
          status,
          note
        );
        showSnackbar(t('status-changed'), 'success');
        updateOrderInOverviewList(orderResponse);
        setSelectedOrder(orderResponse);
      } catch (error) {
        console.error(error);
      }
      resetConfirmModal();
    },
    [
      selectedOrder,
      resetConfirmModal,
      showSnackbar,
      t,
      updateOrderInOverviewList,
      setSelectedOrder,
    ]
  );

  const handleDeleteOrder = useCallback(async () => {
    if (!selectedOrder?.id) return;
    try {
      await orderService.deleteOrder(selectedOrder.id);
      showSnackbar(t('order-deleted'), 'success');
      removeOrderInOverviewList(selectedOrder);
      setSelectedOrder(null);
    } catch (error) {
      console.error(error);
    }
  }, [
    removeOrderInOverviewList,
    selectedOrder,
    setSelectedOrder,
    showSnackbar,
    t,
  ]);

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
          openConfirmModal(
            t('reactivate-confirm'),
            (note: string) =>
              changeOrderStatus(OrderExecutionStatusEnum.ACTIVE, note),
            true
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
          className="archive-btn"
          color="primary"
          fullWidth
          size="medium"
          onClick={() =>
            openConfirmModal(
              t('archive-title'),
              (note: string) =>
                changeOrderStatus(OrderExecutionStatusEnum.ARCHIVED, note),
              true
            )
          }
        >
          {t('archive')}
        </Button>
      )}
      <div className="tracking-id">
        <p>{t('tracking-id', { TRACKING_ID: selectedOrder.trackingId })}</p>
        <IconButton
          className="postal-code-copy"
          onClick={() => {
            navigator.clipboard.writeText(selectedOrder.trackingId);
            showSnackbar(t('postal-code-coppied'), 'success');
          }}
          edge="end"
        >
          <ContentCopyIcon />
        </IconButton>
      </div>
      <Divider />
      <div className="stepper-container">
        {width >= xxsMax ? (
          <Stepper
            className="stepper-container__stepper"
            activeStep={statuses.indexOf(selectedOrder?.status)}
            orientation={width < xxsMax ? 'vertical' : 'horizontal'}
            alternativeLabel={width >= xxsMax}
          >
            {statuses.map((status) => {
              return (
                <Step key={status}>
                  <StepLabel>{t(status)}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        ) : (
          <>
            <div className="stepper-container__status">
              {`Status: ${t(selectedOrder.status)}`}
            </div>
            <Stepper
              className="stepper-container__stepper-mobile"
              activeStep={statuses.indexOf(selectedOrder.status)}
            >
              {statuses.map((status) => (
                <Step
                  key={status}
                  className={classNames({
                    active: status === selectedOrder.status,
                  })}
                >
                  <div className="step"></div>
                </Step>
              ))}
            </Stepper>
          </>
        )}
        <div className="status-history-butons">
          <Button
            variant="outlined"
            onClick={() => setIsStatusHistoryModalOpen(true)}
          >
            {t('view-status-history')}
          </Button>
          {selectedOrder.status !== OrderStatusEnum.DONE && !isArchived && (
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
          )}
        </div>
      </div>
      <Divider />
      <div className="order-info-container">
        <div className="order-info-container__data">
          {shouldShowForm ? (
            <OrderInfoForm />
          ) : (
            <OrderInfoOverview selectedOrder={selectedOrder} />
          )}
        </div>
        {privileges.canAddPayment && (
          <div className="order-info-container__payments">
            <OrderPayments
              payments={selectedOrder.payments}
              orderId={selectedOrder.id}
              isAddingDisabled={
                selectedOrder.executionStatus !==
                OrderExecutionStatusEnum.ACTIVE
              }
            />
          </div>
        )}
      </div>
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
      {selectedOrder.status === OrderStatusEnum.DONE &&
        privileges.canCancelOrder && (
          <div className="action-buttons">
            <Button
              variant="outlined"
              color={'error'}
              onClick={() =>
                openConfirmModal(t('delete-confirm'), handleDeleteOrder, true)
              }
              size="large"
            >
              <p>{t('delete')}</p>
              {<DeleteIcon />}
            </Button>
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
      {isStatusHistoryModalOpen && (
        <StatusHistoryModal
          selectedOrder={selectedOrder}
          isOpen={isStatusHistoryModalOpen}
          onClose={() => setIsStatusHistoryModalOpen(false)}
        />
      )}
      <ConfirmModal {...confirmModalProps} />
    </Styled.OrderDetailsContainer>
  );
};

export default OrderDetailsComponent;

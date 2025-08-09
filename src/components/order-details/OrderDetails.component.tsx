import CancelIcon from '@mui/icons-material/Cancel';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  Tooltip,
} from '@mui/material';
import classNames from 'classnames';
import React, { useCallback, useContext, useMemo, useState } from 'react';
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

export type OrderDetailsProps = { order?: Order };

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const OrderDetailsComponent = () => {
  const { t } = useTranslation();
  const {
    selectedOrder,
    setSelectedOrder,
    setSelectedOrderId,
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

  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
        icon: <PauseIcon />,
        onClick: () =>
          openConfirmModal(t('pause-reason'), (note: string) =>
            changeOrderStatus(OrderExecutionStatusEnum.PAUSED, note)
          ),
      },
      {
        show: privileges.canPauseOrder && isPaused,
        label: t('reactivate'),
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
        icon: <CancelIcon />,
        onClick: () =>
          openConfirmModal(t('cancel-reason'), (note: string) =>
            changeOrderStatus(OrderExecutionStatusEnum.CANCELED, note)
          ),
      },
      {
        show: privileges.canCancelOrder,
        label: t('delete'),
        icon: <DeleteIcon />,
        onClick: () =>
          openConfirmModal(t('delete-confirm'), handleDeleteOrder, true),
      },
      {
        show: canArchive,
        label: t('archive'),
        icon: <Inventory2OutlinedIcon />,
        onClick: () =>
          openConfirmModal(
            t('archive-title'),
            (note: string) =>
              changeOrderStatus(OrderExecutionStatusEnum.ARCHIVED, note),
            true
          ),
      },
    ],
    [
      canArchive,
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
    <Styled.OrderDetailsContainer
      className="order-details"
      key={selectedOrder?.id}
    >
      <IconButton
        size="large"
        onClick={() => setSelectedOrderId(0)}
        className="order-details__close-icon"
      >
        <CloseIcon />
      </IconButton>
      {(isCanceled || isPaused) && nonActiveBanner}
      <div className="order-details__header">
        <div className="order-details__header__tracking-id">
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
        <div className="order-details__header__actions">
          {actionButtons.map(
            ({ show, label, icon, onClick }, index) =>
              show && (
                <Tooltip key={index} title={label}>
                  <IconButton
                    className="order-details__header__actions--btn"
                    onClick={onClick}
                    edge="end"
                  >
                    {icon}
                  </IconButton>
                </Tooltip>
              )
          )}
        </div>
      </div>
      <Divider />
      <div className="order-details__stepper-container">
        {width >= xxsMax ? (
          <Stepper
            className="order-details__stepper-container__stepper"
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
            <div className="order-details__stepper-container__status">
              {`Status: ${t(selectedOrder.status)}`}
            </div>
            <Stepper
              className="order-details__stepper-container__stepper-mobile"
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
        <div className="order-details__stepper-container__buttons">
          {selectedOrder.status !== OrderStatusEnum.DONE &&
            !isArchived &&
            !isMoveButtonDisabled && (
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
                <img
                  src="/arrow-icon.svg"
                  alt="icon"
                  style={{ width: '18px' }}
                />
              </Button>
            )}
        </div>
      </div>
      <Box
        className="order-details__tabs-box"
        sx={{ borderBottom: 1, borderColor: 'red' }}
      >
        <Tabs
          className="order-details__tabs-box__tabs"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label={t('information')} />
          <Tab label={t('change-history')} />
          {privileges.canAddPayment && <Tab label={t('payments')} />}
          <Tab label={t('files')} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {shouldShowForm ? (
          <OrderInfoForm />
        ) : (
          <OrderInfoOverview selectedOrder={selectedOrder} />
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ChangeHistoryComponent orderId={selectedOrder.id} />
      </CustomTabPanel>
      {privileges.canAddPayment && (
        <CustomTabPanel value={value} index={2}>
          <OrderPayments
            orderId={selectedOrder.id}
            isAddingDisabled={
              selectedOrder.executionStatus !== OrderExecutionStatusEnum.ACTIVE
            }
          />
        </CustomTabPanel>
      )}
      <CustomTabPanel value={value} index={3}>
        TODO
      </CustomTabPanel>
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

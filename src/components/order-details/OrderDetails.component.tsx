import CancelIcon from '@mui/icons-material/Cancel';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PauseIcon from '@mui/icons-material/Pause';
import {
  Button,
  Divider,
  IconButton,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { orderService } from '../../api';
import { usePrivileges } from '../../hooks/usePrivileges';
import useResponsiveWidth from '../../hooks/useResponsiveWidth';
import OrdersContext from '../../store/OrdersProvider/Orders.context';
import { Order, OrderStatusEnum } from '../../types/Order';
import { xxsMax } from '../../util/breakpoints';
import { statuses } from '../../util/util';
import StatusChangeModal from '../modals/status-change/StatusChangeModal.component';
import * as Styled from './OrderDetails.styles';
import ChangeHistoryComponent from './components/ChangeHistory.component';
import OrderInfoForm from './components/order-info-form/OrderInfoForm.component';
import OrderInfoOverview from './components/order-info-overview/OrderInfoOverview.component';

export type OrderDetailsProps = {
  order?: Order;
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
};

const OrderDetailsComponent = ({ order }: OrderDetailsProps) => {
  const { t } = useTranslation();

  const { fetchOrders } = useContext(OrdersContext);
  const width = useResponsiveWidth();

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

  const handleOpenStatusModal = useCallback(() => {
    setIsStatusModalOpen(true);
  }, []);

  const handleCloseStatusModal = useCallback(() => {
    setIsStatusModalOpen(false);
  }, []);

  const handlePauseOrder = useCallback(async () => {
    if (!order?.id) return;

    try {
      const response: Order = await orderService.pauseOrder(order?.id, 'test');

      console.log(response);
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  }, [fetchOrders, order?.id]);

  const handleCancelOrder = useCallback(() => {}, []);

  if (!orderData.id) return <></>;
  return (
    <Styled.OrderDetailsContainer key={orderData.id}>
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
      <Stepper
        activeStep={statuses.indexOf(orderData.status)}
        orientation={width < xxsMax ? 'vertical' : 'horizontal'}
      >
        {statuses.map((status) => {
          return (
            <Step key={status}>
              <StepLabel>{t(status)}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <ChangeHistoryComponent statusHistory={orderData.statusHistory} />
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
        {canPauseOrder && (
          <Button
            variant="outlined"
            color="warning"
            className="pause-order"
            onClick={handlePauseOrder}
            size="large"
          >
            <p>pause</p>
            <PauseIcon />
          </Button>
        )}
        {canCancelOrder && (
          <Button
            variant="contained"
            color="error"
            className="cancel-order"
            onClick={handleCancelOrder}
          >
            <p>cancel</p>
            <CancelIcon />
          </Button>
        )}
      </div>
      <StatusChangeModal
        key={`status-modal-${isStatusModalOpen}`}
        orderId={orderData.id}
        currentStatus={orderData.status}
        isOpen={isStatusModalOpen}
        onClose={handleCloseStatusModal}
        setOrderData={setOrderData}
      />
    </Styled.OrderDetailsContainer>
  );
};

export default OrderDetailsComponent;

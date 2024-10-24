import CancelIcon from '@mui/icons-material/Cancel';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PauseIcon from '@mui/icons-material/Pause';
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicDatePicker } from '..';
import useResponsiveWidth from '../../hooks/useResponsiveWidth';
import { Order } from '../../types/Order';
import { xxsMax } from '../../util/breakpoints';
import { statuses } from '../../util/util';
import StatusChangeModal from '../modals/status-change/StatusChangeModal.component';
import * as Styled from './OrderDetails.styles';
import ChangeHistoryComponent from './components/ChangeHistory.component';
import { orderService } from '../../api';
import OrdersContext from '../../store/OrdersProvider/Orders.context';

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
  const [orderData, setOrderData] = useState(order || initialData);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const width = useResponsiveWidth();

  const onSubmit = useCallback(
    async (values: Order) => {
      try {
        const res = await orderService.updateOrder(values);
        console.log(res);
        // todo check if we should refetch, or just update frontend array
        fetchOrders();
      } catch (error) {
        console.error(error);
      }
    },
    [fetchOrders]
  );

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

  const initialValues = useMemo(() => orderData, [orderData]);

  const formik = useFormik<Order>({
    initialValues,
    onSubmit,
  });

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
      <form autoComplete="off" onSubmit={formik.handleSubmit}>
        <TextField
          className="order-name-input"
          label={t('order-name')}
          name="name"
          type="text"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          multiline
          maxRows={4}
        />
        <TextField
          className="order-description-input"
          label={t('description')}
          name="description"
          type="text"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          multiline
          maxRows={4}
        />
        <TextField
          className="order-sale-price-input"
          label={t('sale-price')}
          type="number"
          name="salePrice"
          value={formik.values.salePrice}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <TextField
          className="order-acquisition-cost-input"
          label={t('acquisition-cost')}
          type="number"
          name="acquisitionCost"
          value={formik.values.acquisitionCost}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <div
          className="date-input-container"
          style={{ display: 'flex', gap: '16px', alignItems: 'end' }}
        >
          <p>{t('expected')}</p>
          <BasicDatePicker
            value={dayjs(order?.plannedEndingDate)}
            onChange={(value: Dayjs | null) => {
              console.log(value);
            }}
          />
        </div>

        <FormControlLabel
          label={t('is-legal-entity')}
          className="create-order--is-legal-input"
          control={
            <Checkbox
              name="legalEntity"
              checked={formik.values.legalEntity}
              onChange={formik.handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          }
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          size="medium"
          disabled={!formik.isValid || !formik.dirty}
        >
          {t('save-changes')}
        </Button>
      </form>
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
        // disabled
        onClick={handleOpenStatusModal}
      >
        {t('move-to-next-state')}
      </Button>
      <Divider />
      <div className="action-buttons">
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
        <Button
          variant="contained"
          color="error"
          className="cancel-order"
          onClick={handleCancelOrder}
        >
          <p>cancel</p>
          <CancelIcon />
        </Button>
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

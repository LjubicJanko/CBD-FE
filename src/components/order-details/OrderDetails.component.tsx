import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
import { useFormik } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import { Order } from '../../types/Order';
import { statuses } from '../../util/util';
import StatusChangeModal from '../modals/status-change/StatusChangeModal.component';
import * as Styled from './OrderDetails.styles';
import ChangeHistoryComponent from './components/ChangeHistory.component';
import { BasicDatePicker } from '..';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import useResponsiveWidth from '../../hooks/useResponsiveWidth';
import { xxsMax } from '../../util/breakpoints';

export type OrderDetailsProps = {
  order?: Order;
};

const initialData: Order = {
  id: 0,
  trackingId: '',
  name: '',
  description: '',
  status: 'DESIGN',
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
  const [orderData, setOrderData] = useState(order || initialData);
  const [open, setOpen] = useState(false);
  const width = useResponsiveWidth();

  const onSubmit = (values: Order) => {
    console.log(values);
  };

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const initialValues = useMemo(() => orderData, [orderData]);

  const formik = useFormik<Order>({
    initialValues,
    onSubmit,
  });

  if (!orderData.id) return <></>;
  return (
    <Styled.OrderDetailsContainer key={orderData.id}>
      <div className="tracking-id">
        <p>Tracking id: {orderData.trackingId}</p>
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
        <div style={{ display: 'flex', gap: '16px', alignItems: 'end' }}>
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
          Save changes
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
              <StepLabel>{status}</StepLabel>
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
        onClick={handleOpen}
      >
        Move to next state
      </Button>
      <StatusChangeModal
        orderId={orderData.id}
        currentStatus={orderData.status}
        isOpen={open}
        onClose={handleClose}
        setOrderData={setOrderData}
      />
    </Styled.OrderDetailsContainer>
  );
};

export default OrderDetailsComponent;

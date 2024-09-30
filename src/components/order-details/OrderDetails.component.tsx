import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Button,
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
};

const OrderDetailsComponent = ({ order }: OrderDetailsProps) => {
  const [orderData, setOrderData] = useState(order || initialData);
  const [open, setOpen] = useState(false);

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
      <form autoComplete="off" onSubmit={formik.handleSubmit}>
        <div className="tracking-id">
          <p>Tracking id: {orderData.trackingId}</p>
          <IconButton
            onClick={() => navigator.clipboard.writeText(orderData.trackingId)}
            edge="end"
          >
            <ContentCopyIcon />
          </IconButton>
        </div>
        <TextField
          className="order-name-input"
          label="Order name"
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
          label="Description"
          name="description"
          type="text"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          multiline
          maxRows={4}
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
      <Stepper activeStep={statuses.indexOf(orderData.status)}>
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

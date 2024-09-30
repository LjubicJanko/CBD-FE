import { Step, StepLabel, Stepper } from '@mui/material';
import { Order } from '../../types/Order';
import * as Styled from './OrderTracking.styles';
import { statuses } from '../../util/util';

export type OrderCardComponentProps = {
  order: Order;
};

const OrderTrackingComponent = ({ order }: OrderCardComponentProps) => {
  return (
    <Styled.OrderTrackingContainer>
      <div className="order-header">
        <h2>{order.name} info</h2>
        <h3>{order.description}</h3>
      </div>
      <div className="order-body">
        <Stepper activeStep={statuses.indexOf(order.status)}>
          {statuses.map((status) => {
            return (
              <Step key={status}>
                <StepLabel>{status}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </div>
    </Styled.OrderTrackingContainer>
  );
};

export default OrderTrackingComponent;

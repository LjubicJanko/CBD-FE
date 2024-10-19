import { Step, StepLabel, Stepper } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useResponsiveWidth from '../../hooks/useResponsiveWidth';
import { OrderTracking } from '../../types/Order';
import { xxsMax } from '../../util/breakpoints';
import { statuses } from '../../util/util';
import * as Styled from './OrderTracking.styles';

export type OrderCardComponentProps = {
  order: OrderTracking;
};

const OrderTrackingComponent = ({ order }: OrderCardComponentProps) => {
  const { t } = useTranslation();
  const width = useResponsiveWidth();

  const steps = useMemo(
    () =>
      statuses.map((status) => {
        return (
          <Step key={status}>
            <StepLabel>{status}</StepLabel>
          </Step>
        );
      }),
    []
  );

  return (
    <Styled.OrderTrackingContainer className="order">
      <div className="order__header">
        <h2>{order.name} info</h2>
        <h3>{order.description}</h3>
      </div>
      <div className="order__body">
        {order.status === 'SHIPPED' && (
          <div className="order__body__shipping">
            {t('Shipped via: ')}
            <p className="order__body__shipping--postal-service">
              {order.postalService} -
            </p>
            <p className="order__body__shipping--code">{order.postalCode}</p>
            {/* <IconButton
              className="order__body__shipping--code--copy-icon"
              onClick={() => navigator.clipboard.writeText(order.postalCode)}
              edge="end"
            >
              <ContentCopyIcon />
            </IconButton> */}
          </div>
        )}
        <Stepper
          activeStep={statuses.indexOf(order.status)}
          orientation={width < xxsMax ? 'vertical' : 'horizontal'}
        >
          {steps}
        </Stepper>
        <div className="order__body__ending-date">
          {t('Planned ending: ')}
          <p>{order.plannedEndingDate}</p>
        </div>
        <div className="order__body__left-to-pay">
          {t('Amount left to pay: ')}
          <p>{order.amountLeftToPay}</p>
        </div>
      </div>
    </Styled.OrderTrackingContainer>
  );
};

export default OrderTrackingComponent;

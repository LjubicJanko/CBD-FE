import { Step, StepLabel, Stepper } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useResponsiveWidth from '../../hooks/useResponsiveWidth';
import { OrderTracking } from '../../types/Order';
import { xxsMax } from '../../util/breakpoints';
import { statuses } from '../../util/util';
import * as Styled from './OrderTracking.styles';
import classNames from 'classnames';

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
        <h2>
          {t('order-tracking')}
          {order.name} info
        </h2>
        <h3>
          {t('description')}
          {order.description}
        </h3>
      </div>
      <div className="order__body">
        <div className="order__body__grid">
          <div className="order__body__grid__left-to-pay">
            <p>{t('left-to-pay')}</p>
            <p className={classNames('value')}>{order.amountLeftToPay}</p>
          </div>
          {order.status === 'SHIPPED' && (
            <>
              <div className="order__body__grid__shipping">
                <p>{t('shipped-via')}</p>
                <p
                  className={classNames(
                    'value',
                    'order__body__grid__shipping--postal-service'
                  )}
                >
                  {order.postalService}
                </p>
                {/* <IconButton
              className="order__body__shipping--code--copy-icon"
              onClick={() => navigator.clipboard.writeText(order.postalCode)}
              edge="end"
            >
              <ContentCopyIcon />
            </IconButton> */}
              </div>
              <div className="order__body__grid__shipping-code">
                <p>{t('shipping-code')}</p>
                <p className={classNames('value')}>{order.postalCode}</p>
              </div>
            </>
          )}
          <div className="order__body__grid__status">
            <p>{t('status')}</p>
            <p className={classNames('value')}>{order.status}</p>
          </div>
          <div className="order__body__grid__ending-date">
            <p>{t('expected')}</p>
            <p className={classNames('value')}>{order.plannedEndingDate}</p>
          </div>
        </div>
        <Stepper
          activeStep={statuses.indexOf(order.status)}
          orientation={width < xxsMax ? 'vertical' : 'horizontal'}
        >
          {steps}
        </Stepper>
      </div>
    </Styled.OrderTrackingContainer>
  );
};

export default OrderTrackingComponent;

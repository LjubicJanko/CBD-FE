import { Step, StepLabel, Stepper } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useResponsiveWidth from '../../hooks/useResponsiveWidth';
import { OrderTracking } from '../../types/Order';
import { xxsMax } from '../../util/breakpoints';
import { statuses } from '../../util/util';
import * as Styled from './OrderTracking.styles';
import classNames from 'classnames';
import dayjs from 'dayjs';

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
            <StepLabel>{t(status)}</StepLabel>
          </Step>
        );
      }),
    [t]
  );

  const formatDate = useCallback(
    (date: string) => dayjs(date).format('DD-MM-YYYY'),
    []
  );

  return (
    <Styled.OrderTrackingContainer className="order">
      <div className="order__header">
        <h2>
          {order.name}
        </h2>
        <h3>
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
          <div className="order__body__grid__last-update">
            <p>{t('last-update')}</p>
            <p className={classNames('value')}>
              {formatDate(order.lastUpdatedDate)}
            </p>
          </div>
          <div className="order__body__grid__ending-date">
            <p>{t('expected')}</p>
            <p className={classNames('value')}>
              {formatDate(order.plannedEndingDate)}
            </p>
          </div>
        </div>
        <Stepper
          activeStep={statuses.indexOf(order.status)}
          orientation={width < xxsMax ? 'vertical' : 'horizontal'}
          alternativeLabel={width >= xxsMax}
        >
          {steps}
        </Stepper>
      </div>
    </Styled.OrderTrackingContainer>
  );
};

export default OrderTrackingComponent;

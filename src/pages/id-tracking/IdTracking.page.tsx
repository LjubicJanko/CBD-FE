import {
  Button,
  CircularProgress,
  Step,
  Stepper,
  TextField,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { orderService } from '../../api';
import OrderTrackingComponent from '../../components/order-tracking/OrderTracking.component';
import { OrderTracking } from '../../types/Order';
import * as Styled from './IdTracking.styles';
import { useTranslation } from 'react-i18next';
import useQueryParams from '../../hooks/useQueryParams';
import { statuses } from '../../util/util';
import classNames from 'classnames';
import dayjs from 'dayjs';

const IdTrackingPage = () => {
  const { t } = useTranslation();

  const {
    setQParam,
    params: { id },
  } = useQueryParams<{ id: string | undefined }>();
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(
    id
  );
  const [order, setOrder] = useState<OrderTracking>();

  const formatDate = useCallback(
    (date: string) => dayjs(date).format('DD.MM.YYYY.'),
    []
  );

  const trackOrder = useCallback(
    async (trackingId: string) => {
      if (trackingId === order?.trackingId) return;

      try {
        const response = await orderService.trackOrder(trackingId);
        setOrder(response);
      } catch (error) {
        console.error(error);
      }
    },
    [order?.trackingId]
  );

  useEffect(() => {
    if (!id) {
      setOrder(undefined);
      return;
    }

    trackOrder(id);
  }, [id, trackOrder]);

  if (id && !order)
    return (
      <Styled.LoaderContainer>
        <CircularProgress />
      </Styled.LoaderContainer>
    );

  if (order !== undefined) {
    return (
      <Styled.IdTrackingDetailsContainer className="id-tracking-details">
        {/* Order Status */}
        <div className="id-tracking-details__status">
          {t(`Status: ${t(order.status)}`)}
        </div>

        {/* Stepper */}
        <div className="id-tracking-details__stepper">
          <p className="id-tracking-details__stepper--title">
            {t(`ID: ${id}`)}
          </p>

          <div className="id-tracking-details__stepper--container">
            <Stepper activeStep={statuses.indexOf(order.status)}>
              {statuses.map((status) => (
                <Step
                  key={status}
                  className={classNames({
                    active: status === order.status,
                  })}
                >
                  <div className="step"></div>
                </Step>
              ))}
            </Stepper>
          </div>
        </div>

        {/* Status Info */}
        <div className="id-tracking-details__status-info">
          <img src={`/${order.status}.png`} alt="Current status icon" />
          <div className="id-tracking-details__status-info--text">
            <p className="title">{t(`${order.status}-title`)}</p>
            <p>{t(`${order.status}-disclaimer`)}</p>
          </div>
        </div>

        <div className="id-tracking-details__order-info">
          <p className="id-tracking-details__order-info--title">
            {t('orderDetails.title')}
          </p>
          <div className="id-tracking-details__order-info__container">
            <div className="id-tracking-details__order-info__container--description">
              <p>{t('orderDetails.name')}</p>
              <p>{order.name}</p>
            </div>
            <div className="id-tracking-details__order-info__container--left-to-pay">
              <p>{t('orderDetails.amountLeftToPay')}</p>
              <p>{order.amountLeftToPay}</p>
            </div>
            <div className="id-tracking-details__order-info__container--last-change">
              <p>{t('orderDetails.lastUpdatedDate')}</p>
              <p>{formatDate(order.lastUpdatedDate)}</p>
            </div>
            <div className="id-tracking-details__order-info__container--expected-due">
              <p>{t('orderDetails.plannedEndingDate')}</p>
              <p>{formatDate(order.plannedEndingDate)}</p>
            </div>
          </div>
        </div>
      </Styled.IdTrackingDetailsContainer>
    );
  }

  return (
    <Styled.IdTrackingContainer className="id-tracking">
      <h2 className="id-tracking__title">{t('enterTrackingNumber')}</h2>
      <div className="id-tracking__search-container">
        <TextField
          className="order-id-input"
          placeholder={t('order-tracking-id')}
          value={trackingOrderId}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTrackingOrderId(event.target.value);
          }}
          multiline
          maxRows={4}
        />
        <Button
          className="order-id-search-btn"
          variant="outlined"
          onClick={() => trackingOrderId && setQParam('id', trackingOrderId)}
        >
          {t('search')}
        </Button>
      </div>
      {order && <OrderTrackingComponent order={order} />}
    </Styled.IdTrackingContainer>
  );
};

export default IdTrackingPage;

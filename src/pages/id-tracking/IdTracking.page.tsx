import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Button,
  CircularProgress,
  IconButton,
  Step,
  Stepper,
  TextField,
} from '@mui/material';
import { AxiosError } from 'axios';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { orderService } from '../../api';
import NoContent from '../../components/no-content/NoContent.component';
import useQueryParams from '../../hooks/useQueryParams';
import { useSnackbar } from '../../hooks/useSnackbar';
import { OrderTracking, PostServices } from '../../types/Order';
import { ApiError } from '../../types/Response';
import { statuses, trackingUrl } from '../../util/util';
import * as Styled from './IdTracking.styles';

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
  const [error, setError] = useState<string>('');

  const { showSnackbar } = useSnackbar();

  const formatDate = useCallback(
    (date: string) => dayjs(date).format('DD.MM.YYYY.'),
    []
  );

  const trackOrder = useCallback(
    async (trackingId: string) => {
      if (trackingId === order?.trackingId) return;
      setError('');

      try {
        const response = await orderService.trackOrder(trackingId);
        setOrder(response);
      } catch (error) {
        setError((error as AxiosError<ApiError>).message);
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

  if (id && !order && !error)
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
          {`Status: ${t(order.status)}`}
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
            <div className="id-tracking-details__order-info__container--name">
              <p>{t('orderDetails.name')}</p>
              <p>{order.name}</p>
            </div>
            <div className="id-tracking-details__order-info__container--left-to-pay">
              <p>{t('orderDetails.amountLeftToPay')}</p>
              <p>
                {order.legalEntity
                  ? order.amountLeftToPayWithTax
                  : order.amountLeftToPay}
              </p>
            </div>
            <div className="id-tracking-details__order-info__container--last-change">
              <p>{t('orderDetails.lastUpdatedDate')}</p>
              <p>{formatDate(order.lastUpdatedDate)}</p>
            </div>
            <div className="id-tracking-details__order-info__container--expected-due">
              <p>{t('orderDetails.plannedEndingDate')}</p>
              <p>{dayjs(order.plannedEndingDate).format('DD.MM.YYYY')}</p>
            </div>
            <div className="id-tracking-details__order-info__container--description">
              <p>{t('orderDetails.description')}</p>
              <p>{order.description}</p>
            </div>
            {order.status === 'SHIPPED' && (
              <>
                <div className="id-tracking-details__order-info__container--postal-service">
                  <p>{t('orderDetails.postalService')}</p>
                  <p>{t(order.postalService)}</p>
                </div>
                <div className="id-tracking-details__order-info__container--postal-code">
                  <p>{t('orderDetails.postalCode')}</p>
                  <p>
                    {order.postalCode}
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText(order.postalCode);
                        showSnackbar(t('postal-code-coppied'), 'success');
                      }}
                      edge="end"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </p>
                </div>
                <div className="id-tracking-details__order-info__container--link">
                  <p>{t('orderDetails.postalLink')}</p>
                  <Button
                    variant="outlined"
                    target="_blank"
                    href={`${trackingUrl[order.postalService as PostServices]}`}
                    className="id-tracking-details__order-info__container--link-btn"
                  >
                    {t('track-here')}
                  </Button>
                </div>
              </>
            )}
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
          disabled={!trackingOrderId}
          onClick={() => trackingOrderId && setQParam('id', trackingOrderId)}
        >
          {t('search')}
        </Button>
      </div>
      {error && (
        <>
          <NoContent message={t(error)} />
        </>
      )}
    </Styled.IdTrackingContainer>
  );
};

export default IdTrackingPage;

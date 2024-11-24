import { Button, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { orderService } from '../../api';
import OrderTrackingComponent from '../../components/order-tracking/OrderTracking.component';
import { OrderTracking } from '../../types/Order';
import * as Styled from './IdTracking.styles';
import { useTranslation } from 'react-i18next';

const IdTrackingPage = () => {
  const { t } = useTranslation();
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>();
  const [order, setOrder] = useState<OrderTracking>();

  const trackOrder = useCallback(async () => {
    if (!trackingOrderId) return;
    const response = await orderService.trackOrder(trackingOrderId);
    setOrder(response);
  }, [trackingOrderId]);

  return (
    <Styled.IdTrackingContainer className="id-tracking">
      <div className="id-tracking__search-container">
        <TextField
          className="order-id-input"
          label={t('order-tracking-id')}
          value={trackingOrderId}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTrackingOrderId(event.target.value);
          }}
          multiline
          maxRows={4}
        />
        <Button
          className="order-id-search"
          variant="outlined"
          onClick={trackOrder}
        >
          {t('search')}
        </Button>
      </div>
      {order && <OrderTrackingComponent order={order} />}
    </Styled.IdTrackingContainer>
  );
};

export default IdTrackingPage;

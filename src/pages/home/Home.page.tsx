import { Button, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { orderService } from '../../api';
import OrderTrackingComponent from '../../components/order-tracking/OrderTracking.component';
import { OrderTracking } from '../../types/Order';
import * as Styled from './Home.styles';
import { useTranslation } from 'react-i18next';

const HomeComponent = () => {
  const { t } = useTranslation();
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(
    'c10b3935-4dda-4350-9776-835ec038cf70'
  );
  const [order, setOrder] = useState<OrderTracking>();

  const trackOrder = useCallback(async () => {
    if (!trackingOrderId) return;
    const response = await orderService.trackOrder(trackingOrderId);
    setOrder(response);
    console.log(response);
  }, [trackingOrderId]);

  return (
    <Styled.HomeContainer className="home">
      <div className="home__search-container">
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
    </Styled.HomeContainer>
  );
};

export default HomeComponent;

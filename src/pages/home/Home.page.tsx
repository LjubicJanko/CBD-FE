import { Button, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { orderService } from '../../api';
import OrderTrackingComponent from '../../components/order-tracking/OrderTracking.component';
import { Order } from '../../types/Order';
import * as Styled from './Home.styles';

const HomeComponent = () => {
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>();
  const [order, setOrder] = useState<Order>();

  const trackOrder = useCallback(async () => {
    if (!trackingOrderId) return;
    const response = await orderService.trackOrder(trackingOrderId);
    setOrder(response);
    console.log(response);
  }, [trackingOrderId]);

  console.log(trackingOrderId);
  return (
    <Styled.HomeContainer className="home-page">
      <h1>Please enter your order id</h1>
      <div className="search-container">
        <TextField
          className="order-id-input"
          label="Order tracking id"
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
          SEARCH
        </Button>
      </div>
      {order && <OrderTrackingComponent order={order} />}
    </Styled.HomeContainer>
  );
};

export default HomeComponent;

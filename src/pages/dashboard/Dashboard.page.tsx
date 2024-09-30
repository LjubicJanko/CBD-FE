import { CircularProgress } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { orderService } from '../../api';
import {
  FiltersComponent,
  OrderCardComponent,
  OrderDetailsComponent,
  OrderSearchComponent,
} from '../../components';
import useQueryParams from '../../hooks/useQueryParams';
import { Order } from '../../types/Order';
import * as Styled from './Dashboard.styles';

const DashboardPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const { params } = useQueryParams();

  const handleSearch = useCallback(async (query: string) => {
    try {
      const response: Order[] = await orderService.searchOrders(query);
      setSelectedOrder(0);
      setOrders(response);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        setIsLoading(true);
        const filters = Object.keys(params);
        console.log('fetch filtered');
        const response: Order[] = await orderService.getAll(filters);
        setOrders(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiltered();
  }, [params]);

  return (
    <Styled.DashboardContainer className="dashboard-page">
      <FiltersComponent />
      <OrderSearchComponent onSearch={handleSearch} />
      {isLoading && (
        <div className="loader-wrapper">
          <CircularProgress />
        </div>
      )}
      {!isLoading && (
        <>
          {orders.length === 0 && <p>no records</p>}
          <div className="orders">
            {orders.map((order, index) => (
              <OrderCardComponent
                order={order}
                key={index}
                isSelected={order.id === selectedOrder}
                onClick={() => {
                  if (order.id === selectedOrder) {
                    setSelectedOrder(0);
                  } else {
                    setSelectedOrder(order.id);
                  }
                }}
              />
            ))}
          </div>
          {selectedOrder > 0 && (
            <div className="details">
              <OrderDetailsComponent
                key={selectedOrder}
                order={orders.find((x) => x.id === selectedOrder)}
              />
            </div>
          )}
        </>
      )}
    </Styled.DashboardContainer>
  );
};

export default DashboardPage;

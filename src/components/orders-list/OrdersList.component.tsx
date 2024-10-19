import { Pagination } from '@mui/material';
import { useContext } from 'react';
import OrdersContext from '../../store/OrdersProvider/Orders.context';
import OrderCardComponent from '../order-card/OrderCard.component';
import * as Styled from './OrdersList.styles';

export type OrdersListProps = {
  className?: string;
};

const OrdersList = ({ className }: OrdersListProps) => {
  const { orders, selectedOrder, setSelectedOrderId, page, total, setPage } =
    useContext(OrdersContext);

  const handleChange = (_event: unknown, value: number) => {
    setPage(value - 1);
    setSelectedOrderId(-1);
  };

  if (!orders.length) return <p>no records</p>;

  return (
    <Styled.OrdersListContainer className={className}>
      {orders.map((order, index) => (
        <OrderCardComponent
          order={order}
          key={index}
          isSelected={order.id === selectedOrder?.id}
          onClick={() =>
            setSelectedOrderId(order.id === selectedOrder?.id ? 0 : order.id)
          }
        />
      ))}
      <Pagination count={total} page={page + 1} onChange={handleChange} />
    </Styled.OrdersListContainer>
  );
};

export default OrdersList;

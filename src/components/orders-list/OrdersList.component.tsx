import { useContext } from 'react';
import OrdersContext from '../../store/OrdersProvider/Orders.context';
import NoContent from '../no-content/NoContent.component';
import OrderCardComponent from '../order-card/OrderCard.component';
import * as Styled from './OrdersList.styles';

export type OrdersListProps = {
  className?: string;
};

const OrdersList = ({ className }: OrdersListProps) => {
  const { orders, selectedOrder, setSelectedOrderId } =
    useContext(OrdersContext);

  if (!orders.length) return <NoContent />;

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
    </Styled.OrdersListContainer>
  );
};

export default OrdersList;

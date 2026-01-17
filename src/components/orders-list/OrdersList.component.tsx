import { useContext } from 'react';
import NoContent from '../no-content/NoContent.component';
import OrderCardComponent from '../order-card/OrderCard.component';
import * as Styled from './OrdersList.styles';
import CompanyContext from '../../store/CompanyProvider/Company.context';

export type OrdersListProps = {
  className?: string;
};

const OrdersList = ({ className }: OrdersListProps) => {
  const { orders, selectedOrder, changeSelectedOrderId } =
    useContext(CompanyContext);

  if (!orders.length) return <NoContent />;

  return (
    <Styled.OrdersListContainer className={className}>
      {orders.map((order, index) => (
        <OrderCardComponent
          order={order}
          key={index}
          isSelected={order.id === selectedOrder?.id}
          onClick={() =>
            changeSelectedOrderId(order.id === selectedOrder?.id ? 0 : order.id)
          }
        />
      ))}
    </Styled.OrdersListContainer>
  );
};

export default OrdersList;

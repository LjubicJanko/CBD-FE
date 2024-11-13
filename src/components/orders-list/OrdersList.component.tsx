import { Pagination } from '@mui/material';
import { useContext } from 'react';
import OrdersContext from '../../store/OrdersProvider/Orders.context';
import OrderCardComponent from '../order-card/OrderCard.component';
import * as Styled from './OrdersList.styles';
import NoContent from '../no-content/NoContent.component';
import { useTranslation } from 'react-i18next';

export type OrdersListProps = {
  className?: string;
};

const OrdersList = ({ className }: OrdersListProps) => {
  const { t } = useTranslation();
  const {
    orders,
    selectedOrder,
    page,
    total,
    totalElements,
    setPage,
    setSelectedOrderId,
  } = useContext(OrdersContext);

  const handleChange = (_event: unknown, value: number) => {
    setPage(value - 1);
    setSelectedOrderId(-1);
  };

  if (!orders.length) return <NoContent />;

  return (
    <Styled.OrdersListContainer className={className}>
      <span className="pagination-total">
        {t('pagination-total', {
          TOTAL: totalElements,
        })}
      </span>
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
      <div className="pagination">
        <Pagination count={total} page={page + 1} onChange={handleChange} />
      </div>
    </Styled.OrdersListContainer>
  );
};

export default OrdersList;

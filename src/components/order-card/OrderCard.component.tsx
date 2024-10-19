import { Chip } from '@mui/material';
import classNames from 'classnames';
import { OrderOverview } from '../../types/Order';
import * as Styled from './OrderCard.styles';

export type OrderCardComponentProps = {
  order: OrderOverview;
  isSelected?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const OrderCardComponent = ({
  order,
  isSelected = false,
  onClick,
}: OrderCardComponentProps) => {
  return (
    <Styled.OrderCardContainer
      className={classNames('order-card', {
        'order-card--selected': isSelected,
      })}
      onClick={onClick}
    >
      <h2 className="title">{order.name}</h2>
      <h3 className="description">{order.description}</h3>
      <div className="order-card__footer">
        <p>{order.plannedEndingDate}</p>
        <Chip className="status" label={order.status} />
      </div>
    </Styled.OrderCardContainer>
  );
};

export default OrderCardComponent;

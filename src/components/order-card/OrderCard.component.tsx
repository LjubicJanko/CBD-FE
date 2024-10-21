import { Chip } from '@mui/material';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { OrderOverview } from '../../types/Order';
import * as Styled from './OrderCard.styles';
import { statusColors } from '../../util/util';

export type OrderCardComponentProps = {
  order: OrderOverview;
  isSelected?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const OrderCardComponent = ({
  order,
  isSelected = false,
  onClick,
}: OrderCardComponentProps) => {
  const { t } = useTranslation();
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

        <Chip
          className="status-chip"
          label={t(order.status)}
          style={{
            backgroundColor: statusColors[order.status],
            color: 'white',
          }}
        />
      </div>
    </Styled.OrderCardContainer>
  );
};

export default OrderCardComponent;

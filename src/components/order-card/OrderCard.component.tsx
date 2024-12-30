import { Chip } from '@mui/material';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { OrderExecutionStatusEnum, OrderOverview } from '../../types/Order';
import * as Styled from './OrderCard.styles';
import { statusColors } from '../../util/util';
import { useMemo } from 'react';
import dayjs from 'dayjs';

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

  const { plannedEndingDate } = order;

  const isInPast = useMemo(
    () => dayjs(plannedEndingDate, 'DD.MM.YYYY').isBefore(dayjs()),
    [plannedEndingDate]
  );

  const isPlannedForToday = useMemo(
    () => dayjs(plannedEndingDate, 'DD.MM.YYYY').isSame(dayjs(), 'day'),
    [plannedEndingDate]
  );

  return (
    <Styled.OrderCardContainer
      className={classNames('order-card', {
        'order-card--selected': isSelected,
        'order-card--paused':
          order.executionStatus === OrderExecutionStatusEnum.PAUSED,
      })}
      onClick={onClick}
    >
      <h2 className="title">{order.name}</h2>
      <h3 className="description">{order.description}</h3>
      <div className="order-card__footer">
        <p
          className={classNames('order-card__footer__planned-ending-date', {
            'order-card__footer__planned-ending-date--in-past': isInPast,
            'order-card__footer__planned-ending-date--today': isPlannedForToday,
          })}
        >
          {order.plannedEndingDate}
        </p>

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

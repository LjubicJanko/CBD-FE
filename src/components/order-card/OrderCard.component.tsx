import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  OrderExecutionStatusEnum,
  OrderOverview,
  OrderStatusEnum,
} from '../../types/Order';
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
      <Styled.StatusChip
        className="status-chip"
        label={t(order.status)}
        $backgroundColor={statusColors[order.status]}
      />
      <Styled.Title className="title">{order.name}</Styled.Title>
      <Styled.Description className="description">
        {order.description}
      </Styled.Description>
      <Styled.Footer className="order-card__footer">
        {order.status !== OrderStatusEnum.DONE ? (
          <>
            <p>{t('orderDetails.plannedEndingDate')}</p>
            <Styled.PlannedDate
              className={classNames('order-card__footer__planned-ending-date', {
                'order-card__footer__planned-ending-date--in-past': isInPast,
                'order-card__footer__planned-ending-date--today':
                  isPlannedForToday,
              })}
            >
              {order.plannedEndingDate}
            </Styled.PlannedDate>
          </>
        ) : (
          <>
            <p>{t('orderDetails.dateWhenMovedToDone')}</p>
            <p>{dayjs(order.dateWhenMovedToDone)?.format('DD.MM.YYYY')}</p>
          </>
        )}
      </Styled.Footer>
    </Styled.OrderCardContainer>
  );
};

export default OrderCardComponent;

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
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import dayjs from 'dayjs';
import { Tooltip } from '@mui/material';

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
    () => dayjs(plannedEndingDate, 'YYYY.MM.DD').isBefore(dayjs()),
    [plannedEndingDate]
  );
  console.log(order);

  // const isPlannedForToday = useMemo(
  //   () => dayjs(plannedEndingDate, 'DD.MM.YYYY').isSame(dayjs(), 'day'),
  //   [plannedEndingDate]
  // );

  return (
    <Styled.OrderCardContainer
      className={classNames('order-card', {
        'order-card--selected': isSelected,
        'order-card--paused':
          order.executionStatus === OrderExecutionStatusEnum.PAUSED,
      })}
      onClick={onClick}
    >
      <Styled.Header className="order-card__header">
        <Styled.Title className="title">{order.name}</Styled.Title>
        <Styled.StatusChip
          className="status-chip"
          label={t(order.status)}
          $backgroundColor={statusColors[order.status]}
        />
      </Styled.Header>
      <Styled.Description className="description">
        {order.description}
      </Styled.Description>
      <Styled.Footer className="order-card__footer">
        {order.status !== OrderStatusEnum.DONE ? (
          <div className="order-card__footer__info">
            <p>{t('orderDetails.plannedEndingDate')}</p>
            <p>{dayjs(order.plannedEndingDate).format('DD.MM.YYYY')}</p>
            {isInPast && (
              <Tooltip title={'Prekoračeno vreme završetka!'}>
                <ReportProblemIcon style={{ color: '#D4FF00' }} />
              </Tooltip>
            )}
            {/* <Styled.PlannedDate
              className={classNames(
                'order-card__footer__info__planned-ending-date',
                {
                  'order-card__footer__info__planned-ending-date--in-past':
                    isInPast,
                  'order-card__footer__info__planned-ending-date--today':
                    isPlannedForToday,
                }
              )}
            >
              {dayjs(order.plannedEndingDate).format('DD.MM.YYYY')}
            </Styled.PlannedDate> */}
          </div>
        ) : (
          <div className="order-card__footer__info">
            <p>{t('orderDetails.dateWhenMovedToDone')}</p>
            <p>{dayjs(order.dateWhenMovedToDone)?.format('DD.MM.YYYY')}</p>
          </div>
        )}
        <div className="order-card__footer__info">
          <p>{t('Preostalo za uplatu:')}</p>
          <p>{order.amountLeftToPay} RSD</p>
        </div>
        {order.postalService && (
          <div className="order-card__footer__info">
            <p>{t('Kurirska sluzba: ')}</p>
            <p>
              {t(order.postalService)} ({order.postalCode})
            </p>
          </div>
        )}
      </Styled.Footer>
    </Styled.OrderCardContainer>
  );
};

export default OrderCardComponent;

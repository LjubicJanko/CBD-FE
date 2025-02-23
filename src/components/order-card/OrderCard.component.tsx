import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  OrderExecutionStatusEnum,
  OrderOverview,
  orderPriorityArray,
  OrderStatusEnum,
} from '../../types/Order';
import * as Styled from './OrderCard.styles';
import { statusColors } from '../../util/util';
import { useMemo } from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import dayjs from 'dayjs';
import { Rating, Tooltip } from '@mui/material';

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
          </div>
        ) : (
          <div className="order-card__footer__info">
            <p>{t('orderDetails.dateWhenMovedToDone')}</p>
            <p>{dayjs(order.dateWhenMovedToDone)?.format('DD.MM.YYYY')}</p>
          </div>
        )}
        <div className="order-card__footer__info">
          <p>{t('amountLeftToPay')}</p>
          <p>{order.amountLeftToPay} RSD</p>
        </div>
        {order.postalService && (
          <div className="order-card__footer__info">
            <p>{t('postal-service')}</p>
            <p>
              {t(order.postalService)} ({order.postalCode})
            </p>
          </div>
        )}
        <div className="order-card__footer__info">
          <p>{t('priority')}: </p>
          <p className="order-card__footer__info--priority-value">
            <Rating readOnly max={3} value={orderPriorityArray.indexOf(order.priority) + 1} />
          </p>
        </div>
      </Styled.Footer>
    </Styled.OrderCardContainer>
  );
};

export default OrderCardComponent;

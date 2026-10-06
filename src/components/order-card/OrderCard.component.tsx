import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  OrderExecutionStatusEnum,
  OrderOverview,
  orderPriorityArray,
  OrderStatusEnum,
} from '../../types/Order';
import * as Styled from './OrderCard.styles';
import theme from '../../styles/theme';
import { statusColors } from '../../util/util';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CallMergeIcon from '@mui/icons-material/CallMerge';
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
    () => !!plannedEndingDate && dayjs(plannedEndingDate, 'YYYY.MM.DD').isBefore(dayjs()),
    [plannedEndingDate]
  );

  const descriptionRef = useRef<HTMLHeadingElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // The toggle is only needed when the clamped (collapsed) text is truncated.
  // While expanded the text is unclamped, so keep the last measured value.
  useLayoutEffect(() => {
    const element = descriptionRef.current;
    if (!element || isExpanded) return;

    const measure = () =>
      setIsOverflowing(element.scrollHeight > element.clientHeight + 1);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [order.description, isExpanded]);

  const handleToggleDescription = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    <Styled.OrderCardContainer
      className={classNames('order-card', {
        'order-card--selected': isSelected,
        'order-card--paused':
          order.executionStatus === OrderExecutionStatusEnum.PAUSED,
        'order-card--extension': order.extension,
      })}
      onClick={onClick}
    >
      <Styled.Header className="order-card__header">
        <Styled.Title className="title">
          {order.extension && (
            <Tooltip title={t('extension')}>
              <CallMergeIcon sx={{ color: theme.PRIMARY_2, fontSize: 20, marginRight: '4px', verticalAlign: 'text-bottom' }} />
            </Tooltip>
          )}
          {order.name}
        </Styled.Title>
        <Styled.StatusChip
          className="status-chip"
          label={t(order.status)}
          $backgroundColor={statusColors[order.status]}
        />
      </Styled.Header>
      <Styled.Description
        ref={descriptionRef}
        className={classNames('description', {
          'description--expanded': isExpanded,
        })}
      >
        {order.description}
      </Styled.Description>
      {(isOverflowing || isExpanded) && (
        <Styled.DescriptionToggle
          type="button"
          className="description-toggle"
          aria-expanded={isExpanded}
          onClick={handleToggleDescription}
        >
          {isExpanded ? t('show-less') : t('show-more')}
        </Styled.DescriptionToggle>
      )}
      <Styled.Footer className="order-card__footer">
        {order.status !== OrderStatusEnum.DONE ? (
          <div className="order-card__footer__info">
            <p>{t('orderDetails.plannedEndingDate')}</p>
            <p>{order.plannedEndingDate ? dayjs(order.plannedEndingDate).format('DD.MM.YYYY') : t('not-set')}</p>
            {isInPast && (
              <Tooltip title={'Prekoračeno vreme završetka!'}>
                <ReportProblemIcon style={{ color: theme.PRIMARY_2 }} />
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
          <p>{t('priority')} </p>
          <p className="order-card__footer__info--priority-value">
            <Rating readOnly max={3} value={orderPriorityArray.indexOf(order.priority) + 1} />
          </p>
        </div>
      </Styled.Footer>
    </Styled.OrderCardContainer>
  );
};

export default OrderCardComponent;

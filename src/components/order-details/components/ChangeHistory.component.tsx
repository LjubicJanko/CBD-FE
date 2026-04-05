import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import OrdersContext from '../../../store/OrdersProvider/Orders.context';
import { OrderExecutionStatusEnum, OrderStatusEnum, OrderStatusHistory } from '../../../types/Order';
import * as Styled from './ChangeHistory.styles';
import { ShippedInfoTooltip } from './shipped-tooltip/ShippedTooltip.component';

export type ChangeHistoryProps = {
  orderId: number;
};

const getStatusLabel = (row: OrderStatusHistory, t: (key: string) => string): string => {
  if (row.executionStatus === OrderExecutionStatusEnum.PAUSED) {
    return t('paused');
  }
  if (row.executionStatus === OrderExecutionStatusEnum.ACTIVE) {
    return t('reactivated');
  }
  return row.status ? t(row.status) : '';
};

const isExecutionStatusEntry = (row: OrderStatusHistory): boolean => {
  return row.executionStatus !== null && row.executionStatus !== undefined;
};

const ChangeHistoryComponent = ({ orderId }: ChangeHistoryProps) => {
  const { t } = useTranslation();
  const { statusHistory, isHistoryLoading, fetchStatusHistory } =
    useContext(OrdersContext);

  useEffect(() => {
    fetchStatusHistory(orderId);
  }, [fetchStatusHistory, orderId]);

  if (isHistoryLoading) {
    return (
      <div className="loader-wrapper">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Styled.ChangeHistoryContainer className="change-history">
      <Table
        sx={{ minWidth: 650 }}
        aria-label="simple table"
        className="change-history__table"
      >
        <TableHead className="change-history__header">
          <TableRow>
            <TableCell className="change-history__header-cell">
              {t('status')}
            </TableCell>
            <TableCell className="change-history__header-cell">
              {t('user')}
            </TableCell>
            <TableCell className="change-history__header-cell">
              {t('comment')}
            </TableCell>
            <TableCell className="change-history__header-cell">
              {t('timestamp')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {statusHistory.map((row) => (
            <TableRow
              key={row.id}
              className={classNames('change-history__row', {
                'change-history__row--paused': row.executionStatus === OrderExecutionStatusEnum.PAUSED,
                'change-history__row--reactivated': row.executionStatus === OrderExecutionStatusEnum.ACTIVE,
              })}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                className={classNames(
                  'change-history__cell',
                  'change-history__cell--status',
                  {
                    'change-history__cell--execution-status': isExecutionStatusEntry(row),
                  }
                )}
              >
                <div>{getStatusLabel(row, t)}</div>
              </TableCell>
              <TableCell className="change-history__cell change-history__cell--user">
                {row.user}
              </TableCell>
              <TableCell className="change-history__cell change-history__cell--comment">
                {row.closingComment}
              </TableCell>
              <TableCell className="change-history__cell change-history__cell--timestamp">
                <p>{dayjs(row.creationTime).format('DD.MM.YYYY HH:mm')}</p>
                {row.status === OrderStatusEnum.SHIPPED && (
                  <ShippedInfoTooltip row={row} orderId={orderId} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Styled.ChangeHistoryContainer>
  );
};

export default ChangeHistoryComponent;

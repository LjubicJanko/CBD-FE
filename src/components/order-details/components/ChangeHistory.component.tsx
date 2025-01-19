import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { OrderStatusEnum, OrderStatusHistory } from '../../../types/Order';
import * as Styled from './ChangeHistory.styles';
import { ShippedInfoTooltip } from './shipped-tooltip/ShippedTooltip.component';

export type ChangeHistoryProps = {
  statusHistory: OrderStatusHistory[];
};

const ChangeHistoryComponent = ({ statusHistory }: ChangeHistoryProps) => {
  const { t } = useTranslation();

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
              className="change-history__row"
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                className="change-history__cell change-history__cell--status"
              >
                <div>{t(row.status)}</div>
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
                  <ShippedInfoTooltip row={row} />
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

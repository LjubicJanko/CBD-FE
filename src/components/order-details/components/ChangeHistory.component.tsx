import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { OrderStatusEnum, OrderStatusHistory } from '../../../types/Order';
import { statusColors } from '../../../util/util';
import * as Styled from './ChangeHistory.styles';
import { ShippedInfoTooltip } from './shipped-tooltip/ShippedTooltip.component';

export type ChangeHistoryProps = {
  statusHistory: OrderStatusHistory[];
};

const ChangeHistoryComponent = ({ statusHistory }: ChangeHistoryProps) => {
  const { t } = useTranslation();

  return (
    <Styled.ChangeHistoryContainer>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{t('status')}</TableCell>
              <TableCell align="right">{t('user')}</TableCell>
              <TableCell align="right">{t('comment')}</TableCell>
              <TableCell align="right">{t('timestamp')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statusHistory.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <div>
                    <Chip
                      className="status-chip"
                      label={t(row.status)}
                      style={{
                        backgroundColor: statusColors[row.status],
                        color: 'white',
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell align="right">{row.user}</TableCell>
                <TableCell align="right">{row.closingComment}</TableCell>
                <TableCell align="right">
                  {dayjs(row.creationTime).format('DD-MM-YYYY HH:mm:ss')}
                </TableCell>

                {row.status === OrderStatusEnum.SHIPPED && (
                  <TableCell align="right">
                    <ShippedInfoTooltip row={row} />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Styled.ChangeHistoryContainer>
  );
};

export default ChangeHistoryComponent;

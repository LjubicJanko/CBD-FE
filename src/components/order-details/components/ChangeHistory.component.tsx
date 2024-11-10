import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
import { OrderStatus, OrderStatusHistory } from '../../../types/Order';
import * as Styled from './ChangeHistory.styles';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { statusColors, statuses } from '../../../util/util';
import { xxsMax } from '../../../util/breakpoints';
import useResponsiveWidth from '../../../hooks/useResponsiveWidth';

export type ChangeHistoryProps = {
  statusHistory: OrderStatusHistory[];
  status: OrderStatus;
};

const ChangeHistoryComponent = ({
  statusHistory,
  status,
}: ChangeHistoryProps) => {
  const { t } = useTranslation();
  const width = useResponsiveWidth();

  return (
    <Styled.ChangeHistoryContainer>
      <h2>{t('status-change-history')}</h2>
      <Stepper
        className="stepper"
        activeStep={statuses.indexOf(status)}
        orientation={width < xxsMax ? 'vertical' : 'horizontal'}
      >
        {statuses.map((status) => {
          return (
            <Step key={status}>
              <StepLabel>{t(status)}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
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
                  <Chip
                    className="status-chip"
                    label={t(row.status)}
                    style={{
                      backgroundColor: statusColors[row.status],
                      color: 'white',
                    }}
                  />
                </TableCell>
                <TableCell align="right">{row.user}</TableCell>
                <TableCell align="right">{row.closingComment}</TableCell>
                <TableCell align="right">
                  {dayjs(row.creationTime).format('DD-MM-YYYY HH:mm:ss')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Styled.ChangeHistoryContainer>
  );
};

export default ChangeHistoryComponent;

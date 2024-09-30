import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from '@mui/material';
import { OrderStatusHistory } from '../../../types/Order';
import * as Styled from './ChangeHistory.styles';
import dayjs from 'dayjs';

export type ChangeHistoryProps = {
  statusHistory: OrderStatusHistory[];
};

const ChangeHistoryComponent = ({ statusHistory }: ChangeHistoryProps) => {
  return (
    <Styled.ChangeHistoryContainer>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell align="right">User</TableCell>
              <TableCell align="right">Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statusHistory.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Chip label={row.status} />
                </TableCell>
                <TableCell align="right">{row.user}</TableCell>
                <TableCell align="right">
                  {dayjs(row.timestamp).format('DD-MM-YYYY HH:mm:ss')}
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

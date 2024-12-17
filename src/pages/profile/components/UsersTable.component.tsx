import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import NoContent from '../../../components/no-content/NoContent.component';
import { useTranslation } from 'react-i18next';
import { User } from '../../../types/Auth';
import dayjs from 'dayjs';
import theme from '../../../styles/theme';

export type UsersTableProps = {
  users: User[];
};

const UsersTable = ({ users }: UsersTableProps) => {
  const { t } = useTranslation();

  if (!users || !users.length) return <NoContent />;
  return (
    <TableContainer component={Paper}>
      <Table aria-label="payments table">
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.SECONDARY_3 }}>
            <TableCell>{t('full-name')}</TableCell>
            <TableCell>{t('username')}</TableCell>
            <TableCell>{t('role')}</TableCell>
            <TableCell>{t('created-at')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {user.fullName}
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.roles?.[0]?.name}</TableCell>
              <TableCell>
                {dayjs(user.createdAt).format('DD.MM.YYYY')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersTable;

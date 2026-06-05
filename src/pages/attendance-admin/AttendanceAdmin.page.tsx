import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  MenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  attendanceService,
  locationService,
  profileService,
} from '../../api';
import { AttendanceSession } from '../../types/Attendance';
import { WorkLocation } from '../../types/WorkLocation';
import { usePrivileges } from '../../hooks/usePrivileges';
import SnackbarContext from '../../store/SnackbarProvider/Snackbar.context';
import AttendanceEditDialog, {
  UserOption,
} from './AttendanceEditDialog.component';
import * as Styled from './AttendanceAdmin.styles';

const PAGE_SIZE = 20;

const formatDuration = (seconds: number | null): string => {
  if (seconds === null) return '-';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
};

const AttendanceAdminPage = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useContext(SnackbarContext);
  const { canEditAttendance } = usePrivileges();

  const [rows, setRows] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [users, setUsers] = useState<UserOption[]>([]);
  const [locations, setLocations] = useState<WorkLocation[]>([]);

  // Attendance is a daily operational view, so the page is day-at-a-time:
  // `day` (YYYY-MM-DD) drives the main list and defaults to today. The admin
  // steps through days; user/location/open-only filters compose on top.
  const today = dayjs().format('YYYY-MM-DD');
  const [day, setDay] = useState(today);
  const [filterUser, setFilterUser] = useState<number | ''>('');
  const [filterLocation, setFilterLocation] = useState<number | ''>('');
  const [filterOpenOnly, setFilterOpenOnly] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [editingSession, setEditingSession] =
    useState<AttendanceSession | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      // Guard against NaN (e.g. a user option with no id) ever reaching the
      // query string — the BE 500s on `userId=NaN`.
      const userId =
        typeof filterUser === 'number' && !Number.isNaN(filterUser)
          ? filterUser
          : undefined;
      const locationId = filterLocation === '' ? undefined : filterLocation;
      const scope = { userId, locationId };

      if (filterOpenOnly) {
        // "Open only" ignores the day entirely — show everyone currently on
        // the clock, paginated.
        const response = await attendanceService.list({
          ...scope,
          openOnly: true,
          page,
          size: PAGE_SIZE,
        });
        setRows(response.data);
        setTotalPages(response.total);
        setTotalElements(response.totalElements);
        return;
      }

      // Day view: the selected day's sessions, with any currently-open
      // sessions pinned on top (even if they checked in on another day) so an
      // employee still on the clock is never missing. Open sessions are only
      // fetched/pinned on the first page to avoid repeating them across pages.
      const [dayResp, openResp] = await Promise.all([
        attendanceService.list({ ...scope, date: day, page, size: PAGE_SIZE }),
        page === 0
          ? attendanceService.list({
              ...scope,
              openOnly: true,
              page: 0,
              size: 100,
            })
          : Promise.resolve(null),
      ]);

      const openSessions = openResp?.data ?? [];
      const openIds = new Set(openSessions.map((s) => s.id));
      // Drop the day's rows that are already in the pinned open set (an open
      // session that checked in today would otherwise appear twice).
      const dayRows = dayResp.data.filter((s) => !openIds.has(s.id));

      setRows(page === 0 ? [...openSessions, ...dayRows] : dayRows);
      setTotalPages(dayResp.total);
      setTotalElements(dayResp.totalElements);
    } catch (error) {
      console.error(error);
      showSnackbar(t('attendance.load-failed'), 'error');
    } finally {
      setLoading(false);
    }
  }, [day, filterUser, filterLocation, filterOpenOnly, page, showSnackbar, t]);

  // Load the user + location dropdown options once. Locations get re-listed by
  // their own page; we accept a small chance of staleness here in exchange for
  // not refetching on every filter change.
  useEffect(() => {
    profileService
      .getAllUsers()
      // Normalize the user id from either `id` or `userId`, and drop any option
      // without a numeric id so the filter can never send `userId=NaN`.
      .then((data: Array<Partial<UserOption> & { userId?: number }>) =>
        setUsers(
          data
            .map((u) => ({
              id: (u.id ?? u.userId) as number,
              fullName: u.fullName ?? u.username ?? '',
              username: u.username ?? '',
            }))
            .filter((u) => Number.isFinite(u.id))
        )
      )
      .catch(console.error);
    locationService.list().then(setLocations).catch(console.error);
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  // Any filter/day change resets to the first page so we never land on an
  // out-of-range page from the previous query.
  const goToDay = useCallback((next: string) => {
    setDay(next);
    setPage(0);
  }, []);

  const prevDay = useCallback(
    () => goToDay(dayjs(day).subtract(1, 'day').format('YYYY-MM-DD')),
    [day, goToDay]
  );

  const nextDay = useCallback(
    () => goToDay(dayjs(day).add(1, 'day').format('YYYY-MM-DD')),
    [day, goToDay]
  );

  const goToday = useCallback(() => goToDay(today), [goToDay, today]);

  const openCreate = useCallback(() => {
    setDialogMode('create');
    setEditingSession(null);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((session: AttendanceSession) => {
    setDialogMode('edit');
    setEditingSession(session);
    setDialogOpen(true);
  }, []);

  const handleSaved = useCallback(
    (saved: AttendanceSession) => {
      // For create: just refetch. For edit: splice in place so the user keeps
      // their place in the table.
      if (dialogMode === 'create') {
        fetchRows();
      } else {
        setRows((old) => old.map((r) => (r.id === saved.id ? saved : r)));
      }
    },
    [dialogMode, fetchRows]
  );

  const handlePageChange = useCallback(
    (_event: unknown, value: number) => {
      setPage(value - 1);
    },
    []
  );

  const tableBody = useMemo(() => {
    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={canEditAttendance ? 7 : 6} className="attendance-admin__empty">
            {t('attendance.admin.no-results')}
          </TableCell>
        </TableRow>
      );
    }
    return rows.map((row) => (
      <TableRow key={row.id}>
        <TableCell
          className="attendance-admin__employee"
          data-label={t('attendance.admin.employee')}
        >
          {row.fullName}
        </TableCell>
        <TableCell data-label={t('attendance.admin.location')}>
          {row.locationName}
        </TableCell>
        <TableCell data-label={t('attendance.admin.checked-in')}>
          {dayjs(row.checkInAt).format('YYYY-MM-DD HH:mm')}
        </TableCell>
        <TableCell
          className={classNames({
            'attendance-admin__muted': !row.checkOutAt,
          })}
          data-label={t('attendance.admin.checked-out')}
        >
          {row.checkOutAt
            ? dayjs(row.checkOutAt).format('YYYY-MM-DD HH:mm')
            : '—'}
        </TableCell>
        <TableCell data-label={t('attendance.admin.duration')}>
          {formatDuration(row.durationSeconds)}
        </TableCell>
        <TableCell data-label={t('status')}>
          <div className="attendance-admin__chips">
            {!row.checkOutAt && (
              <span className="attendance-admin__chip attendance-admin__chip--open">
                {t('attendance.admin.open')}
              </span>
            )}
            {row.autoClosed && (
              <span className="attendance-admin__chip attendance-admin__chip--auto">
                {t('attendance.admin.auto-closed')}
              </span>
            )}
            {row.checkOutAt && !row.autoClosed && (
              <span className="attendance-admin__chip attendance-admin__chip--closed">
                {t('attendance.admin.closed')}
              </span>
            )}
          </div>
        </TableCell>
        {canEditAttendance && (
          <TableCell align="right" className="attendance-admin__actions-cell">
            <Tooltip title={t('attendance.admin.edit-entry')}>
              <IconButton
                className="attendance-admin__edit"
                size="small"
                onClick={() => openEdit(row)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </TableCell>
        )}
      </TableRow>
    ));
  }, [canEditAttendance, openEdit, rows, t]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Styled.Container className="attendance-admin">
      <div className="attendance-admin__header">
        <h1 className="attendance-admin__title">
          {t('attendance.admin.title')}{' '}
          <span className="attendance-admin__count">{totalElements}</span>
        </h1>
        {canEditAttendance && (
          <Button
            variant="contained"
            className="attendance-admin__btn"
            startIcon={<AddIcon />}
            onClick={openCreate}
          >
            {t('attendance.admin.create-manual')}
          </Button>
        )}
      </div>

      <div className="attendance-admin__panel">
        <div className="attendance-admin__day-nav">
          <IconButton
            className="attendance-admin__day-step"
            onClick={prevDay}
            disabled={filterOpenOnly}
            aria-label={t('attendance.admin.prev-day')}
          >
            <ChevronLeftIcon />
          </IconButton>
          <DatePicker
            value={dayjs(day)}
            onChange={(val) => val && goToDay(val.format('YYYY-MM-DD'))}
            format="DD.MM.YYYY"
            disableFuture
            disabled={filterOpenOnly}
            slotProps={{ textField: { size: 'small' } }}
          />
          <IconButton
            className="attendance-admin__day-step"
            onClick={nextDay}
            disabled={filterOpenOnly || day >= today}
            aria-label={t('attendance.admin.next-day')}
          >
            <ChevronRightIcon />
          </IconButton>
          <Button
            variant="outlined"
            className="attendance-admin__btn"
            onClick={goToday}
            disabled={filterOpenOnly || day === today}
          >
            {t('attendance.admin.today')}
          </Button>
        </div>

        <div className="attendance-admin__filters">
          <TextField
            select
            label={t('attendance.admin.filter-user')}
            value={filterUser}
            onChange={(e) => {
              setFilterUser(e.target.value === '' ? '' : Number(e.target.value));
              setPage(0);
            }}
            size="small"
          >
            <MenuItem value="">
              {t('attendance.admin.filter-all-users')}
            </MenuItem>
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.fullName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label={t('attendance.admin.filter-location')}
            value={filterLocation}
            onChange={(e) => {
              setFilterLocation(
                e.target.value === '' ? '' : Number(e.target.value)
              );
              setPage(0);
            }}
            size="small"
          >
            <MenuItem value="">
              {t('attendance.admin.filter-all-locations')}
            </MenuItem>
            {locations.map((l) => (
              <MenuItem key={l.id} value={l.id}>
                {l.name}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            className="attendance-admin__open-only"
            control={
              <Checkbox
                checked={filterOpenOnly}
                onChange={(e) => {
                  setFilterOpenOnly(e.target.checked);
                  setPage(0);
                }}
              />
            }
            label={t('attendance.admin.filter-open-only')}
          />
          <span className="attendance-admin__filters-actions-spacer" />
          <Tooltip title={t('update')}>
            <span>
              <IconButton
                className="attendance-admin__refresh"
                onClick={fetchRows}
                disabled={loading}
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>

      {loading ? (
        <div className="attendance-admin__loader">
          <CircularProgress />
        </div>
      ) : (
        <>
          <TableContainer className="attendance-admin__table-wrapper">
            <Table className="attendance-admin__table">
              <TableHead>
                <TableRow>
                  <TableCell>{t('attendance.admin.employee')}</TableCell>
                  <TableCell>{t('attendance.admin.location')}</TableCell>
                  <TableCell>{t('attendance.admin.checked-in')}</TableCell>
                  <TableCell>{t('attendance.admin.checked-out')}</TableCell>
                  <TableCell>{t('attendance.admin.duration')}</TableCell>
                  <TableCell>{t('status')}</TableCell>
                  {canEditAttendance && <TableCell />}
                </TableRow>
              </TableHead>
              <TableBody>{tableBody}</TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <div className="attendance-admin__pagination">
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      <AttendanceEditDialog
        open={dialogOpen}
        mode={dialogMode}
        session={editingSession}
        users={users}
        locations={locations}
        onClose={() => setDialogOpen(false)}
        onSaved={handleSaved}
      />
    </Styled.Container>
    </LocalizationProvider>
  );
};

export default AttendanceAdminPage;

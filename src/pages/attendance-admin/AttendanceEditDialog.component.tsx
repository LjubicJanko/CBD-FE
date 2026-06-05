import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { attendanceService } from '../../api';
import {
  AttendanceAdminCreate,
  AttendanceAdminPatch,
  AttendanceSession,
} from '../../types/Attendance';
import { WorkLocation } from '../../types/WorkLocation';
import SnackbarContext from '../../store/SnackbarProvider/Snackbar.context';
import { textInputSX } from '../../util/util';
import { DialogBody } from './AttendanceAdmin.styles';

export type UserOption = {
  id: number;
  fullName: string;
  username: string;
};

export type AttendanceEditDialogProps = {
  open: boolean;
  mode: 'create' | 'edit';
  session: AttendanceSession | null;
  users: UserOption[];
  locations: WorkLocation[];
  onClose: () => void;
  onSaved: (saved: AttendanceSession) => void;
};

const AttendanceEditDialog: React.FC<AttendanceEditDialogProps> = ({
  open,
  mode,
  session,
  users,
  locations,
  onClose,
  onSaved,
}) => {
  const { t } = useTranslation();
  const { showSnackbar } = useContext(SnackbarContext);

  const [userId, setUserId] = useState<number | ''>('');
  const [locationId, setLocationId] = useState<number | ''>('');
  const [checkInAt, setCheckInAt] = useState<Dayjs | null>(null);
  const [checkOutAt, setCheckOutAt] = useState<Dayjs | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [rangeError, setRangeError] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && session) {
      setUserId(session.userId);
      setLocationId(session.locationId);
      setCheckInAt(session.checkInAt ? dayjs(session.checkInAt) : null);
      setCheckOutAt(session.checkOutAt ? dayjs(session.checkOutAt) : null);
      setNotes(session.notes ?? '');
    } else {
      setUserId('');
      setLocationId('');
      setCheckInAt(null);
      setCheckOutAt(null);
      setNotes('');
    }
    setRangeError(false);
  }, [mode, open, session]);

  const canSave = useMemo(() => {
    if (saving) return false;
    if (!checkInAt) return false;
    if (mode === 'create') {
      if (userId === '' || locationId === '') return false;
    }
    if (checkOutAt && checkInAt && checkOutAt.isBefore(checkInAt)) {
      return false;
    }
    return true;
  }, [checkInAt, checkOutAt, locationId, mode, saving, userId]);

  const handleSave = async () => {
    if (!checkInAt) return;
    if (checkOutAt && checkOutAt.isBefore(checkInAt)) {
      setRangeError(true);
      return;
    }
    setSaving(true);
    try {
      let saved: AttendanceSession;
      if (mode === 'create') {
        const payload: AttendanceAdminCreate = {
          userId: userId as number,
          locationId: locationId as number,
          checkInAt: checkInAt.toISOString(),
          checkOutAt: checkOutAt ? checkOutAt.toISOString() : undefined,
          notes: notes || undefined,
        };
        saved = await attendanceService.createManual(payload);
        showSnackbar(t('attendance.admin.create-success'), 'success');
      } else if (session) {
        const patch: AttendanceAdminPatch = {
          checkInAt: checkInAt.toISOString(),
          checkOutAt: checkOutAt ? checkOutAt.toISOString() : undefined,
          notes: notes || undefined,
        };
        saved = await attendanceService.patchSession(session.id, patch);
        showSnackbar(t('attendance.admin.save-success'), 'success');
      } else {
        return;
      }
      onSaved(saved);
      onClose();
    } catch (error) {
      console.error(error);
      showSnackbar(
        t(
          mode === 'create'
            ? 'attendance.admin.create-error'
            : 'attendance.admin.save-error'
        ),
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t(
          mode === 'create'
            ? 'attendance.admin.create-manual'
            : 'attendance.admin.edit-entry'
        )}
      </DialogTitle>
      <DialogBody>
        {mode === 'create' && (
          <>
            <TextField
              select
              fullWidth
              label={t('attendance.admin.employee')}
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
              sx={textInputSX}
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.fullName} ({u.username})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label={t('attendance.admin.location')}
              value={locationId}
              onChange={(e) => setLocationId(Number(e.target.value))}
              sx={textInputSX}
            >
              {locations.map((l) => (
                <MenuItem key={l.id} value={l.id}>
                  {l.name}
                </MenuItem>
              ))}
            </TextField>
            <p className="attendance-dialog__note">
              {t('attendance.admin.manual-note')}
            </p>
          </>
        )}
        <DateTimePicker
          label={t('attendance.admin.checked-in')}
          value={checkInAt}
          onChange={(val) => {
            setCheckInAt(val);
            setRangeError(false);
          }}
          format="DD.MM.YYYY HH:mm"
          ampm={false}
          disableFuture
          slotProps={{
            textField: { fullWidth: true, sx: textInputSX },
          }}
        />
        <DateTimePicker
          label={t('attendance.admin.checked-out')}
          value={checkOutAt}
          onChange={(val) => {
            setCheckOutAt(val);
            setRangeError(false);
          }}
          format="DD.MM.YYYY HH:mm"
          ampm={false}
          disableFuture
          minDateTime={checkInAt ?? undefined}
          slotProps={{
            textField: {
              fullWidth: true,
              sx: textInputSX,
              error: rangeError,
              helperText: rangeError
                ? t('attendance.admin.invalid-time-range')
                : '',
            },
          }}
        />
        <TextField
          fullWidth
          multiline
          minRows={2}
          label={t('attendance.admin.notes')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={textInputSX}
        />
      </DialogBody>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          className="attendance-dialog__btn attendance-dialog__btn--text"
          onClick={onClose}
          disabled={saving}
        >
          {t('cancel')}
        </Button>
        <Button
          variant="contained"
          className="attendance-dialog__btn attendance-dialog__btn--save"
          onClick={handleSave}
          disabled={!canSave}
        >
          {saving && <CircularProgress size={16} style={{ marginRight: 8 }} />}
          {t('save-changes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttendanceEditDialog;

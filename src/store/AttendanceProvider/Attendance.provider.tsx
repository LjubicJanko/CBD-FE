import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { attendanceService } from '../../api';
import {
  AttendanceReason,
  CheckOutResponse,
  CurrentSession,
} from '../../types/Attendance';
import AttendanceContext, { AttendanceStatus } from './Attendance.context';
import SnackbarContext from '../SnackbarProvider/Snackbar.context';
import { GeolocationError, useGeolocation } from '../../hooks/useGeolocation';
import { usePrivileges } from '../../hooks/usePrivileges';

type ErrorBody = { message?: string; reason?: AttendanceReason };

const isAttendanceReason = (value: unknown): value is AttendanceReason =>
  value === 'out_of_geofence' ||
  value === 'already_checked_in' ||
  value === 'not_checked_in' ||
  value === 'no_active_locations';

const AttendanceProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useContext(SnackbarContext);
  const { canCheckIn } = usePrivileges();
  const { getCurrentPosition } = useGeolocation();

  const [currentSession, setCurrentSession] = useState<CurrentSession | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<AttendanceStatus>('idle');

  const refresh = useCallback(async () => {
    if (!canCheckIn) {
      setCurrentSession(null);
      return;
    }
    setLoading(true);
    try {
      const session = await attendanceService.getCurrentSession();
      setCurrentSession(session);
    } catch (error) {
      console.error(error);
      showSnackbar(t('attendance.load-failed'), 'error');
    } finally {
      setLoading(false);
    }
  }, [canCheckIn, showSnackbar, t]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleError = useCallback(
    (error: unknown, fallbackKey: string) => {
      if (error instanceof GeolocationError) {
        showSnackbar(t(`attendance.error.${error.reason}`), 'error');
        return;
      }
      const axiosError = error as AxiosError<ErrorBody>;
      const reason = axiosError.response?.data?.reason;
      if (reason && isAttendanceReason(reason)) {
        showSnackbar(t(`attendance.error.${reason}`), 'error');
        // If the BE tells us state has drifted (already_checked_in /
        // not_checked_in) refresh so the button reflects reality.
        if (reason === 'already_checked_in' || reason === 'not_checked_in') {
          refresh();
        }
        return;
      }
      if (axiosError.response?.data?.message) {
        showSnackbar(axiosError.response.data.message, 'error');
        return;
      }
      showSnackbar(t(fallbackKey), 'error');
    },
    [refresh, showSnackbar, t]
  );

  const checkIn = useCallback(async (): Promise<CurrentSession | null> => {
    setStatus('locating');
    try {
      const coords = await getCurrentPosition();
      setStatus('submitting');
      const session = await attendanceService.checkIn(coords);
      setCurrentSession(session);
      showSnackbar(t('attendance.check-in-success'), 'success');
      return session;
    } catch (error) {
      handleError(error, 'attendance.error.network');
      return null;
    } finally {
      setStatus('idle');
    }
  }, [getCurrentPosition, handleError, showSnackbar, t]);

  const checkOut = useCallback(async (): Promise<CheckOutResponse | null> => {
    setStatus('locating');
    try {
      const coords = await getCurrentPosition();
      setStatus('submitting');
      const result = await attendanceService.checkOut(coords);
      setCurrentSession(null);
      showSnackbar(t('attendance.check-out-success'), 'success');
      return result;
    } catch (error) {
      handleError(error, 'attendance.error.network');
      return null;
    } finally {
      setStatus('idle');
    }
  }, [getCurrentPosition, handleError, showSnackbar, t]);

  return (
    <AttendanceContext.Provider
      value={{ currentSession, loading, status, refresh, checkIn, checkOut }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceProvider;

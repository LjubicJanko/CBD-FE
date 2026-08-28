import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { attendanceService, locationService } from '../../api';
import {
  AttendanceReason,
  CheckOutResponse,
  CurrentSession,
} from '../../types/Attendance';
import { CheckInMethod } from '../../types/WorkLocation';
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
  // Defaults to true (fail open) so a slow/failed locations fetch doesn't
  // hide a working GPS flow, see the field doc in Attendance.context.ts.
  const [hasGeofenceLocations, setHasGeofenceLocations] = useState(true);
  const [currentSessionCheckInMethod, setCurrentSessionCheckInMethod] =
    useState<CheckInMethod | null>(null);

  const refresh = useCallback(async () => {
    if (!canCheckIn) {
      setCurrentSession(null);
      return;
    }
    setLoading(true);
    // allSettled rather than all: the session fetch is the more important,
    // more volatile piece (it changes every time the user checks in/out
    // anywhere, including the QR scan page), a transient failure on the
    // rarely-changing locations fetch shouldn't also discard a perfectly
    // good session result, and vice versa.
    const [sessionResult, locationsResult] = await Promise.allSettled([
      attendanceService.getCurrentSession(),
      locationService.list(true),
    ]);

    if (sessionResult.status === 'fulfilled') {
      setCurrentSession(sessionResult.value);
    } else {
      console.error(sessionResult.reason);
    }

    if (locationsResult.status === 'fulfilled') {
      const locations = locationsResult.value;
      setHasGeofenceLocations(
        locations.some((location) => location.checkInMethod === 'GEOFENCE')
      );
      // Only derivable when THIS round's session fetch also succeeded, on a
      // stale/failed session result we leave the previous value in place
      // rather than guess.
      if (sessionResult.status === 'fulfilled') {
        const session = sessionResult.value;
        setCurrentSessionCheckInMethod(
          session
            ? locations.find((location) => location.id === session.locationId)
                ?.checkInMethod ?? null
            : null
        );
      }
    } else {
      console.error(locationsResult.reason);
    }

    if (sessionResult.status === 'rejected' || locationsResult.status === 'rejected') {
      showSnackbar(t('attendance.load-failed'), 'error');
    }
    setLoading(false);
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

  const value = useMemo(
    () => ({
      currentSession,
      loading,
      status,
      hasGeofenceLocations,
      currentSessionCheckInMethod,
      refresh,
      checkIn,
      checkOut,
    }),
    [
      currentSession,
      loading,
      status,
      hasGeofenceLocations,
      currentSessionCheckInMethod,
      refresh,
      checkIn,
      checkOut,
    ]
  );

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceProvider;

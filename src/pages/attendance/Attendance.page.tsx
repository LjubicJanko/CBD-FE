import { Button, CircularProgress } from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import AttendanceContext from '../../store/AttendanceProvider/Attendance.context';
import * as Styled from './Attendance.styles';

const formatDuration = (seconds: number): string => {
  if (seconds < 0) seconds = 0;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
};

const AttendancePage = () => {
  const { t } = useTranslation();
  const { currentSession, loading, status, checkIn, checkOut } =
    useContext(AttendanceContext);

  // Drives the live duration display on the open session card. We bump it
  // once a minute so the "Worked Xh Ym" line stays current without rerendering
  // anything else on the page.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!currentSession) return;
    const interval = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(interval);
  }, [currentSession]);

  const durationSeconds = useMemo(() => {
    if (!currentSession) return 0;
    return Math.floor((now - new Date(currentSession.checkInAt).getTime()) / 1000);
  }, [currentSession, now]);

  const acting = status !== 'idle';

  const actionLabel = useMemo(() => {
    if (status === 'locating') return t('attendance.locating');
    if (status === 'submitting') {
      return currentSession
        ? t('attendance.checking-out')
        : t('attendance.checking-in');
    }
    return currentSession ? t('attendance.check-out') : t('attendance.check-in');
  }, [currentSession, status, t]);

  if (loading && !currentSession) {
    return (
      <Styled.AttendanceContainer className="attendance-page">
        <CircularProgress />
      </Styled.AttendanceContainer>
    );
  }

  return (
    <Styled.AttendanceContainer className="attendance-page">
      <h1 className="attendance-page__title">{t('attendance.title')}</h1>

      <div className="attendance-page__card">
        {currentSession ? (
          <>
            <span className="attendance-page__status-label">
              {t('attendance.admin.checked-in')}
            </span>
            <div className="attendance-page__primary-line">
              {t('attendance.checked-in-at', {
                TIME: dayjs(currentSession.checkInAt).format('HH:mm'),
              })}
            </div>
            <div className="attendance-page__secondary-line">
              {t('attendance.at-location', {
                LOCATION: currentSession.locationName,
              })}
            </div>
            <div className="attendance-page__duration">
              {t('attendance.duration', {
                DURATION: formatDuration(durationSeconds),
              })}
            </div>
            <Button
              className="attendance-page__action attendance-page__action--out"
              variant="outlined"
              fullWidth
              disabled={acting}
              onClick={() => checkOut()}
            >
              {acting && (
                <CircularProgress size={20} style={{ marginRight: 12 }} />
              )}
              {actionLabel}
            </Button>
          </>
        ) : (
          <>
            <span className="attendance-page__status-label">
              {t('attendance.title')}
            </span>
            <div className="attendance-page__primary-line">
              {t('attendance.not-checked-in')}
            </div>
            <Button
              className="attendance-page__action attendance-page__action--in"
              variant="contained"
              fullWidth
              disabled={acting}
              onClick={() => checkIn()}
            >
              {acting && (
                <CircularProgress size={20} style={{ marginRight: 12 }} />
              )}
              {actionLabel}
            </Button>
          </>
        )}
      </div>
    </Styled.AttendanceContainer>
  );
};

export default AttendancePage;

import { Button, CircularProgress } from '@mui/material';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import AttendanceContext from '../../store/AttendanceProvider/Attendance.context';
import { usePrivileges } from '../../hooks/usePrivileges';
import * as Styled from './AttendanceCard.styles';

const AttendanceCard = () => {
  const { t } = useTranslation();
  const { canCheckIn } = usePrivileges();
  const { currentSession, status, checkIn, checkOut } =
    useContext(AttendanceContext);

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

  if (!canCheckIn) return null;

  return (
    <Styled.Container className="attendance-card">
      <div className="attendance-card__info">
        <span className="attendance-card__title">{t('attendance.title')}</span>
        {currentSession ? (
          <>
            <span className="attendance-card__primary">
              {t('attendance.checked-in-at', {
                TIME: dayjs(currentSession.checkInAt).format('HH:mm'),
              })}
            </span>
            <span className="attendance-card__secondary">
              {t('attendance.at-location', {
                LOCATION: currentSession.locationName,
              })}
            </span>
          </>
        ) : (
          <span className="attendance-card__primary">
            {t('attendance.not-checked-in')}
          </span>
        )}
      </div>
      <Button
        variant={currentSession ? 'outlined' : 'contained'}
        className={`attendance-card__action attendance-card__action--${currentSession ? 'out' : 'in'}`}
        disabled={acting}
        onClick={() => (currentSession ? checkOut() : checkIn())}
      >
        {acting && <CircularProgress size={16} style={{ marginRight: 8 }} />}
        {actionLabel}
      </Button>
    </Styled.Container>
  );
};

export default AttendanceCard;

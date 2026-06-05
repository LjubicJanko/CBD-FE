import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttendanceContext from '../../store/AttendanceProvider/Attendance.context';
import { usePrivileges } from '../../hooks/usePrivileges';
import * as Styled from './AttendanceButton.styles';

const formatDuration = (seconds: number): string => {
    if (seconds < 0) seconds = 0;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
};

/**
 * Header attendance indicator. Check-in/out is a deliberate, geolocation-gated
 * action, so it lives on the Prisustvo tab (`/attendance`) — not here. This
 * component is purely a passive "on the clock" badge: it renders nothing when
 * the user isn't checked in, and a live elapsed-time pill (ticking each minute)
 * while a session is open. Tapping it opens the Prisustvo tab to check out.
 */
const AttendanceButton = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { canCheckIn } = usePrivileges();
    const { currentSession, loading } = useContext(AttendanceContext);

    // Bump once a minute so the elapsed-time label stays current. Only runs
    // while a session is open; cleaned up on checkout/unmount.
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        if (!currentSession) return;
        setNow(Date.now());
        const interval = window.setInterval(() => setNow(Date.now()), 60_000);
        return () => window.clearInterval(interval);
    }, [currentSession]);

    const elapsed = useMemo(() => {
        if (!currentSession) return '';
        const seconds = Math.floor(
            (now - new Date(currentSession.checkInAt).getTime()) / 1000
        );
        return formatDuration(seconds);
    }, [currentSession, now]);

    // Nothing to show: no privilege, still loading, or not checked in.
    if (!canCheckIn || loading || !currentSession) return null;

    return (
        <Styled.AttendanceBtn
            className="attendance-btn attendance-btn--out"
            onClick={() => navigate('/attendance?tab=me')}
            aria-label={t('attendance.checked-in-at', {
                TIME: dayjs(currentSession.checkInAt).format('HH:mm'),
            })}
            title={t('attendance.checked-in-at', {
                TIME: dayjs(currentSession.checkInAt).format('HH:mm'),
            })}
        >
            <AccessTimeIcon className="attendance-btn__icon" />
            <span className="attendance-btn__text">{elapsed}</span>
        </Styled.AttendanceBtn>
    );
};

export default AttendanceButton;

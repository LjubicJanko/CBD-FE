import { Button, CircularProgress, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import * as Styled from './AttendanceScan.styles';
import { attendanceService, publicTenantService } from '../../api';
import { getLogoAbsoluteUrl } from '../../api/services/platform';
import { PublicTenant } from '../../api/services/publicTenant';
import AuthContext from '../../store/AuthProvider/Auth.context';
import { usePrivileges } from '../../hooks/usePrivileges';
import { useGeolocation } from '../../hooks/useGeolocation';
import { isReservedSlug } from '../../util/reservedSlugs';
import { Feature } from '../../util/features';
import { useApplyTenantTheme } from '../../hooks/useApplyTenantTheme';
import {
  AttendanceReason,
  CurrentSession,
  ScanLocationInfo,
  ScanResult,
} from '../../types/Attendance';
import { LoginData } from '../../types/Auth';
import { formatDuration } from '../../util/util';

// GPS is best-effort audit metadata on this flow, never a gate: give
// watchPosition a short window to hand back an already-cached fix, then
// proceed with whatever we have (including nothing).
const GPS_GRACE_MS = 4000;

type ScanErrorBody = { reason?: AttendanceReason; message?: string };

const AttendanceScanPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tenantSlug, token } = useParams<{
    tenantSlug: string;
    token: string;
  }>();
  const {
    token: authToken,
    authData,
    login,
    logout,
    isLoading: authLoading,
  } = useContext(AuthContext);
  const { canCheckIn } = usePrivileges();
  const { getCurrentPosition } = useGeolocation();

  // Login is username/password only, it doesn't take the URL's tenantSlug as
  // input (that param is branding-only here, same as on /login/:tenantSlug),
  // so a logged-in account can belong to a different tenant than the one this
  // code was printed for. That includes a stale session from a shared/kiosk
  // device. Catch the mismatch with a clear message instead of letting it
  // surface as a confusing 404 from the scan POST. Superadmins are excluded
  // entirely by canCheckIn already, so this only applies to regular users.
  const tenantMismatch = Boolean(
    authToken &&
      !authData?.superadmin &&
      authData?.tenantSlug &&
      tenantSlug &&
      authData.tenantSlug !== tenantSlug
  );

  const [tenant, setTenant] = useState<PublicTenant | null>(null);
  const [locationInfo, setLocationInfo] = useState<ScanLocationInfo | null>(
    null
  );
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);

  const [currentSession, setCurrentSession] = useState<CurrentSession | null>(
    null
  );
  // Starts true (not false): the session-fetch effect below fires
  // synchronously on mount whenever we're already authenticated (the common
  // case, e.g. a returning employee), but effects run after the first paint.
  // Starting false would let that first paint render "Check in?" for a beat
  // before the fetch flips it, even for someone who's actually checked in.
  const [sessionLoading, setSessionLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // fetching tenant when tenant slug changes, to apply tenant theme and show tenant name/logo on the page
  useEffect(() => {
    if (!tenantSlug || isReservedSlug(tenantSlug)) {
      setTenant(null);
      return;
    }
    
    let cancelled = false;
    
    publicTenantService
      .getTenantBySlug(tenantSlug)
      .then((data) => {
        if (!cancelled) setTenant(data);
      })
      .catch(() => {
        if (!cancelled) setTenant(null);
      });
    return () => {
      cancelled = true;
    };
  }, [tenantSlug]);

  useApplyTenantTheme(
    tenant?.accentColor,
    tenant?.backgroundColor,
    Boolean(tenant?.features?.includes(Feature.THEMING))
  );

  // fetching scan location for authenticated users, to show location name on the page 
  // and check if user has permission to check in/out
  useEffect(() => {
    if (!tenantSlug || !token) return;
    
    let cancelled = false;
    setLocationLoading(true);
    setLocationError(false);
    
    attendanceService
      .getScanLocation(tenantSlug, token)
      .then((info) => {
        if (!cancelled) setLocationInfo(info);
      })
      .catch(() => {
        if (!cancelled) setLocationError(true);
      })
      .finally(() => {
        if (!cancelled) setLocationLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tenantSlug, token]);

  // Only to drive the confirm-card wording ("Check in?" vs "Check out?"), the
  // scan POST itself reports back which action it actually took.
  useEffect(() => {
    if (!authToken || !canCheckIn || tenantMismatch) {
      setCurrentSession(null);
      return;
    }

    let cancelled = false;
    setSessionLoading(true);
    
    attendanceService
      .getCurrentSession()
      .then((session) => {
        if (!cancelled) setCurrentSession(session);
      })
      .catch(() => {
        if (!cancelled) setCurrentSession(null);
      })
      .finally(() => {
        if (!cancelled) setSessionLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authToken, canCheckIn, tenantMismatch]);

  const loginFormik = useFormik<LoginData>({
    initialValues: { username: '', password: '' },
    onSubmit: (values) => {
      // No-op navigate: this page renders the next phase reactively once
      // AuthContext.token updates, so there's nowhere else to send the user.
      login(values, () => {});
    },
  });

  const handleConfirm = async () => {
    if (!token) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const coords = await Promise.race([
        getCurrentPosition().catch(() => null),
        new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), GPS_GRACE_MS)
        ),
      ]);
      const response = await attendanceService.scan(token, {
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
        accuracy: coords?.accuracy ?? null,
      });
      setResult(response);
    } catch (error) {
      const axiosError = error as AxiosError<ScanErrorBody>;
      const status = axiosError.response?.status;
      const reason = axiosError.response?.data?.reason;
      if (status === 404) {
        setSubmitError(t('attendance.scan.invalid-code'));
      } else if (reason === 'already_checked_in') {
        setSubmitError(t('attendance.error.already_checked_in'));
      } else {
        setSubmitError(t('attendance.scan.scan-error'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const tenantLogo = getLogoAbsoluteUrl(tenant?.logoUrl);
  const brand = (
    <div className="attendance-scan__brand">
      {tenantLogo && (
        <img
          className="attendance-scan__logo"
          src={tenantLogo}
          alt={tenant?.name ?? ''}
        />
      )}
      <h1 className="attendance-scan__title">
        {tenant?.name ?? t('app-name')}
      </h1>
    </div>
  );

  if (locationLoading) {
    return (
      <Styled.AttendanceScanContainer className="attendance-scan">
        <CircularProgress />
      </Styled.AttendanceScanContainer>
    );
  }

  if (locationError || !locationInfo) {
    return (
      <Styled.AttendanceScanContainer className="attendance-scan">
        {brand}
        <div className="attendance-scan__card">
          <p className="attendance-scan__error" role="alert">
            {t('attendance.scan.invalid-code')}
          </p>
        </div>
      </Styled.AttendanceScanContainer>
    );
  }

  if (result) {
    const isCheckIn = result.action === 'CHECK_IN';
    return (
      <Styled.AttendanceScanContainer className="attendance-scan">
        {brand}
        <div className="attendance-scan__card">
          <CheckCircleIcon className="attendance-scan__result-icon" />
          <p className="attendance-scan__result-text" aria-live="polite">
            {isCheckIn
              ? t('attendance.scan.checked-in-result', {
                  LOCATION: result.locationName,
                  TIME: dayjs(result.checkInAt).format('HH:mm'),
                })
              : t('attendance.scan.checked-out-result', {
                  LOCATION: result.locationName,
                  DURATION: formatDuration(result.durationSeconds ?? 0),
                })}
          </p>
          <Button
            className="attendance-scan__action"
            variant="contained"
            fullWidth
            onClick={() => navigate('/attendance')}
          >
            {t('attendance.scan.go-to-app')}
          </Button>
        </div>
      </Styled.AttendanceScanContainer>
    );
  }

  if (!authToken) {
    return (
      <Styled.AttendanceScanContainer className="attendance-scan">
        {brand}
        <div className="attendance-scan__card">
          <p className="attendance-scan__location">
            {locationInfo.locationName}
          </p>
          <p className="attendance-scan__question">
            {t('attendance.scan.login-required')}
          </p>
          <form
            className="attendance-scan__login-form"
            autoComplete="off"
            onSubmit={loginFormik.handleSubmit}
          >
            <div>
              <label htmlFor="scan-username">{t('username')}</label>
              <TextField
                id="scan-username"
                fullWidth
                name="username"
                value={loginFormik.values.username}
                onChange={loginFormik.handleChange}
              />
            </div>
            <div>
              <label htmlFor="scan-password">{t('password')}</label>
              <TextField
                id="scan-password"
                fullWidth
                type="password"
                name="password"
                value={loginFormik.values.password}
                onChange={loginFormik.handleChange}
              />
            </div>
            <Button
              className="attendance-scan__login-btn"
              variant="contained"
              fullWidth
              type="submit"
              disabled={authLoading}
            >
              {authLoading ? (
                <CircularProgress size={20} />
              ) : (
                t('login')
              )}
            </Button>
          </form>
        </div>
      </Styled.AttendanceScanContainer>
    );
  }

  if (tenantMismatch) {
    return (
      <Styled.AttendanceScanContainer className="attendance-scan">
        {brand}
        <div className="attendance-scan__card">
          <p className="attendance-scan__location">
            {locationInfo.locationName}
          </p>
          <p className="attendance-scan__error" role="alert">
            {t('attendance.scan.tenant-mismatch')}
          </p>
          <Button
            className="attendance-scan__not-now"
            onClick={logout}
          >
            {t('logout')}
          </Button>
        </div>
      </Styled.AttendanceScanContainer>
    );
  }

  if (!canCheckIn) {
    return (
      <Styled.AttendanceScanContainer className="attendance-scan">
        {brand}
        <div className="attendance-scan__card">
          <p className="attendance-scan__location">
            {locationInfo.locationName}
          </p>
          <p className="attendance-scan__error" role="alert">
            {t('attendance.scan.no-permission')}
          </p>
        </div>
      </Styled.AttendanceScanContainer>
    );
  }

  if (sessionLoading) {
    return (
      <Styled.AttendanceScanContainer className="attendance-scan">
        {brand}
        <CircularProgress />
      </Styled.AttendanceScanContainer>
    );
  }

  const acting = submitting;
  const isCheckingOut = Boolean(currentSession);

  return (
    <Styled.AttendanceScanContainer className="attendance-scan">
      {brand}
      <div className="attendance-scan__card">
        <p className="attendance-scan__location">
          {locationInfo.locationName}
        </p>
        <p className="attendance-scan__question">
          {isCheckingOut
            ? t('attendance.scan.check-out-question', {
                LOCATION: locationInfo.locationName,
              })
            : t('attendance.scan.check-in-question', {
                LOCATION: locationInfo.locationName,
              })}
        </p>
        {submitError && (
          <p className="attendance-scan__error" role="alert">
            {submitError}
          </p>
        )}
        <Button
          className="attendance-scan__action"
          variant="contained"
          fullWidth
          disabled={acting}
          onClick={handleConfirm}
        >
          {acting && (
            <CircularProgress size={20} style={{ marginRight: 12 }} />
          )}
          {isCheckingOut ? t('attendance.check-out') : t('attendance.check-in')}
        </Button>
        <Button
          className="attendance-scan__not-now"
          onClick={() => navigate('/attendance')}
          disabled={acting}
        >
          {t('attendance.scan.not-now')}
        </Button>
      </div>
    </Styled.AttendanceScanContainer>
  );
};

export default AttendanceScanPage;

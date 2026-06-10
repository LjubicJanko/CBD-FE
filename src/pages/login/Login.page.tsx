import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../../store/AuthProvider/Auth.context';
import { LoginData } from '../../types/Auth';
import { textInputSX } from '../../util/util';
import { publicTenantService } from '../../api';
import { getLogoAbsoluteUrl } from '../../api/services/platform';
import { PublicTenant } from '../../api/services/publicTenant';
import { isReservedSlug } from '../../util/reservedSlugs';
import { Feature } from '../../util/features';
import { useApplyTenantTheme } from '../../hooks/useApplyTenantTheme';
import * as Styled from './Login.styles';


const initialValues: LoginData = {
  username: '',
  password: '',
};

const LoginComponent = () => {
  const { login, isLoading } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const envSlug = import.meta.env.VITE_TENANT_SLUG as string | undefined;

  // Brand the login page by slug (logo + name + theme), mirroring the public
  // home/track pages. Login must always work, so an unknown/reserved slug just
  // falls back to the default palette instead of blocking the form.
  const [tenant, setTenant] = useState<PublicTenant | null>(null);

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

  const onSubmit = (values: LoginData) => {
    login(values, navigate);
  };

  const formik = useFormik<LoginData>({
    initialValues,
    onSubmit,
  });
  const [showPassword, setShowPassword] = useState(false);

  const tenantLogo = getLogoAbsoluteUrl(tenant?.logoUrl);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // Default the slugless /login to the configured tenant (e.g. /login/cbd) so
  // the page is always branded. Navigating from a tenant's pages keeps its slug.
  if (!tenantSlug && envSlug) {
    return <Navigate to={`/login/${envSlug}`} replace />;
  }

  return (
    <Styled.LoginContainer className="login-container">
      {isLoading && (
        <div className="login-container__loader-wrapper">
          <CircularProgress />
        </div>
      )}
      <form autoComplete="off" onSubmit={formik.handleSubmit}>
        {tenantLogo ? (
          <img
            className="login-container__logo"
            src={tenantLogo}
            alt={tenant?.name ?? ''}
          />
        ) : (
          <h1 className="login-container__title">
            {tenant?.name ?? t('app-name')}
          </h1>
        )}
        <div className="fields">
          <div className="login-container__username">
            <label id="username-label">{t('username')}</label>
            <TextField
              aria-labelledby="username-label"
              variant="outlined"
              color="primary"
              type="text"
              name="username"
              placeholder={t('username')}
              className="login-container__username__field"
              fullWidth
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </div>
          <div className="login-container__password">
            <label id="password-label">{t('password')}</label>
            <OutlinedInput
              aria-labelledby="password-label"
              id="outlined-adornment-password"
              className="login-container__password__field"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder={t('password')}
              value={formik.values.password}
              onChange={formik.handleChange}
              sx={textInputSX}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </div>
        </div>
        <Button
          variant="contained"
          className="login-btn"
          color="primary"
          type="submit"
          fullWidth
          size="medium"
          disabled={!formik.isValid}
        >
          {t('login')}
        </Button>
      </form>
    </Styled.LoginContainer>
  );
};

export default LoginComponent;
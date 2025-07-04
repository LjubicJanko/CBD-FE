import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { useContext, useState } from 'react';
import AuthContext from '../../store/AuthProvider/Auth.context';
import { LoginData } from '../../types/Auth';
import * as Styled from './Login.styles';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';
import { textInputSX } from '../../util/util';

const initialValues: LoginData = {
  username: '',
  password: '',
};

const LoginComponent = () => {
  const { login, isLoading } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onSubmit = (values: LoginData) => {
    login(values, navigate);
  };

  const formik = useFormik<LoginData>({
    initialValues,
    onSubmit,
  });
  const [showPassword, setShowPassword] = useState(false);

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

  return (
    <Styled.LoginContainer className="login-container">
      {isLoading && (
        <div className="login-container__loader-wrapper">
          <CircularProgress />
        </div>
      )}
      <form autoComplete="off" onSubmit={formik.handleSubmit}>
        <div className="fields">
          <TextField
            variant="outlined"
            color="primary"
            type="text"
            name="username"
            placeholder={t('username')}
            fullWidth
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <OutlinedInput
            id="outlined-adornment-password"
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

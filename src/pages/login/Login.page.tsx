import {
  Button,
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

const initialValues: LoginData = {
  username: '',
  password: '',
};

const LoginComponent = () => {
  const { login } = useContext(AuthContext);
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
      <form autoComplete="off" onSubmit={formik.handleSubmit}>
        <div className="fields">
          <TextField
            label="username"
            variant="outlined"
            color="primary"
            type="text"
            name="username"
            placeholder="username"
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
            value={formik.values.password}
            onChange={formik.handleChange}
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
            label="Password"
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          size="medium"
          disabled={!formik.isValid}
        >
          Login
        </Button>
      </form>
    </Styled.LoginContainer>
  );
};

export default LoginComponent;

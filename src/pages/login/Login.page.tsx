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
    const res = login(values, navigate);
    console.log(res);
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
        {/* <Typography variant="h5" fontWeight={600} mb={2}>
          Login Form
        </Typography> */}
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
      {/* <Formik
        initialValues={{ username: '', password: '' } as LoginData}
        validate={(values) => {
          const errors: { username?: string } = {};
          if (!values.username) {
            errors.username = 'Required';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const res = login(values);
          console.log(res);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="username" />
            <ErrorMessage name="username" component="div" />
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik> */}
    </Styled.LoginContainer>
  );
};

export default LoginComponent;

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import AuthContext from '../../store/AuthProvider/Auth.context';
import { RegisterData } from '../../types/Auth';
import * as Styled from './Signup.styles';

const roles = ['admin', 'manager', 'manufacturer', 'consumer'];

const SignupPage = () => {
  const { t } = useTranslation();
  const { signup } = useContext(AuthContext);

  const initialValues = {
    username: '',
    password: '',
    fullName: '',
    role: '',
  } as RegisterData;

  const handleSubmit = useCallback(
    (values: RegisterData, { resetForm }: FormikHelpers<RegisterData>) => {
      signup(values);
      resetForm();
    },
    [signup]
  );

  const formik = useFormik<RegisterData>({
    initialValues,
    onSubmit: handleSubmit,
  });

  return (
    <Styled.SignupContainer>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          className="fullname-input"
          label={t('full-name')}
          name="fullName"
          type="text"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <TextField
          className="username-input"
          label={t('username')}
          name="username"
          type="text"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <TextField
          className="password-input"
          label={t('password')}
          name="password"
          type="text"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <FormControl fullWidth>
          <InputLabel id="role-input-label">{t('role')}</InputLabel>
          <Select
            labelId="role-input-label"
            className="role-input"
            id="role-input"
            name="role"
            value={formik.values.role}
            label={t('role')}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="medium"
          type="submit"
          disabled={!formik.isValid}
          className="submit-button"
        >
          {t('signup')}
        </Button>
      </form>
    </Styled.SignupContainer>
  );
};

export default SignupPage;

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { profileService } from '../../../../api';
import { RegisterData, User } from '../../../../types/Auth';
import { textInputSX } from '../../../../util/util';
import UsersTable from '../UsersTable.component';
import * as Styled from './AddUser.styles';
import { useSnackbar } from '../../../../hooks/useSnackbar';

const signUpInitialValues = {
  username: '',
  password: '',
  fullName: '',
  role: '',
} as RegisterData;

const roles = ['admin', 'manager', 'manufacturer'];
const AddUser = () => {
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const [allUsers, setAllUsers] = useState<User[]>([]);

  const { showSnackbar } = useSnackbar();

  const [areUsersLoading, setAreUsersLoading] = useState(false);

  const fetchAllUsers = useCallback(async () => {
    try {
      const users = await profileService.getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSignUp = useCallback(
    async (
      values: RegisterData,
      { resetForm }: FormikHelpers<RegisterData>
    ) => {
      setAreUsersLoading(true);
      try {
        await profileService.signup(values);
        resetForm();
        fetchAllUsers();
        showSnackbar(t('user-created'), 'success');
      } catch (e) {
        console.error(e);
        showSnackbar('Failed', 'error');
      } finally {
        setAreUsersLoading(false);
      }
    },
    [fetchAllUsers, showSnackbar, t]
  );

  const validationSignupSchema = Yup.object({
    fullName: Yup.string().required(t('validation.required.full-name')),
    username: Yup.string().required(t('validation.required.username')),
    password: Yup.string().required(t('validation.required.password')),
    role: Yup.string().required(t('validation.required.role')),
  });

  const signUpFormik = useFormik({
    initialValues: signUpInitialValues,
    validationSchema: validationSignupSchema,
    onSubmit: handleSignUp,
    enableReinitialize: true,
  });

  const isSubmitDisabled = useMemo(
    () => !signUpFormik.isValid || !signUpFormik.dirty,
    [signUpFormik.isValid, signUpFormik.dirty]
  );

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

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  if (areUsersLoading) {
    return (
      <div className="loader-wrapper">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Styled.AddUserContainer className="signup-container">
      <form onSubmit={signUpFormik.handleSubmit}>
        <h3>{t('add-user')}</h3>
        <TextField
          className="fullname-input"
          label={t('full-name')}
          name="fullName"
          type="text"
          value={signUpFormik.values.fullName}
          onChange={signUpFormik.handleChange}
          onBlur={signUpFormik.handleBlur}
          error={
            signUpFormik.touched.fullName &&
            Boolean(signUpFormik.errors.fullName)
          }
          helperText={
            signUpFormik.touched.fullName && signUpFormik.errors.fullName
          }
        />
        <TextField
          className="signup-username-input"
          label={t('username')}
          name="username"
          type="text"
          value={signUpFormik.values.username}
          onChange={signUpFormik.handleChange}
          onBlur={signUpFormik.handleBlur}
          error={
            signUpFormik.touched.username &&
            Boolean(signUpFormik.errors.username)
          }
          helperText={
            signUpFormik.touched.username && signUpFormik.errors.username
          }
        />
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder={t('password')}
          value={signUpFormik.values.password}
          onChange={signUpFormik.handleChange}
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
        <FormControl fullWidth>
          <InputLabel id="role-input-label">{t('role')}</InputLabel>
          <Select
            labelId="role-input-label"
            className="role-input"
            id="role-input"
            name="role"
            value={signUpFormik.values.role}
            label={t('role')}
            onChange={signUpFormik.handleChange}
            onBlur={signUpFormik.handleBlur}
          >
            {roles.map((role) => (
              <MenuItem className="role-item" key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          className="add-user"
          variant="contained"
          type="submit"
          fullWidth
          disabled={isSubmitDisabled}
        >
          {t('add-user')}
        </Button>
      </form>
      <Styled.UsersContainer className="users-container">
        <h3>{t('all-users')}</h3>
        <UsersTable users={allUsers} />
      </Styled.UsersContainer>
    </Styled.AddUserContainer>
  );
};

export default AddUser;

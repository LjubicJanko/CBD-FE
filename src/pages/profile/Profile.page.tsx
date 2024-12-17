import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Snackbar,
  TextField,
} from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthContext from '../../store/AuthProvider/Auth.context';
import { RegisterData, User } from '../../types/Auth';
import { textInputSX } from '../../util/util';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import * as Yup from 'yup';
import * as Styled from './Profile.styles';
import { profileService } from '../../api';
import UsersTable from './components/UsersTable.component';
import CloseIcon from '@mui/icons-material/Close';

type ChangePasswordData = {
  newPassword: string;
  oldPassword: string;
};

const initialValues: ChangePasswordData = {
  newPassword: '',
  oldPassword: '',
};

const signUpInitialValues = {
  username: '',
  password: '',
  fullName: '',
  role: '',
} as RegisterData;

type SnackbarConfigProps = {
  isOpen: boolean;
  message: string;
};

const initialSnackbarConfig = {
  isOpen: false,
  message: '',
};

const roles = ['admin', 'manager', 'manufacturer'];

const ProfilePage = () => {
  const { authData } = useContext(AuthContext);
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [snackbarConfig, setSnackbarConfig] = useState<SnackbarConfigProps>(
    initialSnackbarConfig
  );
  const { roles: userRoles } = authData ?? {};

  const isAdmin = userRoles?.includes('admin');

  const handleChangePassword = useCallback(
    async (
      values: ChangePasswordData,
      { resetForm }: FormikHelpers<ChangePasswordData>
    ) => {
      const { newPassword, oldPassword } = values;
      const { username } = authData ?? {};
      if (!username) return;

      try {
        await profileService.changePassword({
          username,
          newPassword,
          oldPassword,
        });
        setSnackbarConfig({
          isOpen: true,
          message: 'successfully changed password',
        });
        resetForm();
      } catch (error) {
        console.error(error);
        setSnackbarConfig({
          isOpen: true,
          message: 'failed',
        });
      }
    },
    [authData]
  );

  const validationChangePasswordSchema = Yup.object({
    newPassword: Yup.string().required(t('required')),
    oldPassword: Yup.string().required(t('required')),
  });

  const changePasswordFormik = useFormik({
    initialValues,
    validationSchema: validationChangePasswordSchema,
    onSubmit: handleChangePassword,
    enableReinitialize: true,
  });

  const isChangePasswordDisabled = useMemo(
    () => !changePasswordFormik.isValid || !changePasswordFormik.dirty,
    [changePasswordFormik.isValid, changePasswordFormik.dirty]
  );

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
      try {
        await profileService.signup(values);
        resetForm();
        fetchAllUsers();
        setSnackbarConfig({
          isOpen: true,
          message: 'successfully added new user',
        });
      } catch (e) {
        console.error(e);
        setSnackbarConfig({
          isOpen: true,
          message: 'failed',
        });
      }
    },
    [fetchAllUsers]
  );

  const validationSignupSchema = Yup.object({
    fullName: Yup.string().required(t('required')),
    username: Yup.string().required(t('required')),
    password: Yup.string().required(t('required')),
    role: Yup.string().required(t('required')),
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

  const handleClose = useCallback(
    () => setSnackbarConfig(initialSnackbarConfig),
    []
  );

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return (
    <Styled.ProfilePageContainer className="profile">
      {/* <div className="profile__cards">
        <Button>{t('personal-info')}</Button>
        <Button>{t('add-user')}</Button>
        <Button>{t('users')}</Button>
      </div> */}
      <div className="profile__panel"></div>
      <form
        className="profile__change-password"
        autoComplete="off"
        onSubmit={changePasswordFormik.handleSubmit}
      >
        <h3>{t('change-password')}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="profile__change-password__input">
            {t('old-password')}
            <OutlinedInput
              id="outlined-old-password"
              className="profile__change-password__input--oldPassword"
              type={showPassword ? 'text' : 'password'}
              name="oldPassword"
              placeholder={t('password')}
              value={changePasswordFormik.values.oldPassword}
              onChange={changePasswordFormik.handleChange}
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
          <div className="profile__change-password__input">
            {t('new-password')}
            <OutlinedInput
              id="outlined-new-password"
              className="profile__change-password__input--newPassword"
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              placeholder={t('password')}
              value={changePasswordFormik.values.newPassword}
              onChange={changePasswordFormik.handleChange}
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
          className="profile__change-password__button"
          variant="contained"
          type="submit"
          disabled={isChangePasswordDisabled}
        >
          {t('change-password')}
        </Button>
      </form>

      {isAdmin && (
        <Styled.SignupContainer className="signup-container">
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
        </Styled.SignupContainer>
      )}
      <Styled.UsersContainer className="users-container">
        <h3>{t('all-users')}</h3>
        <UsersTable users={allUsers} />
      </Styled.UsersContainer>

      <Snackbar
        open={snackbarConfig.isOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbarConfig.message}
        action={action}
      />
    </Styled.ProfilePageContainer>
  );
};

export default ProfilePage;

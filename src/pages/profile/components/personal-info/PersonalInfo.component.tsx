import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { profileService } from '../../../../api';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import AuthContext from '../../../../store/AuthProvider/Auth.context';
import { ChangePasswordData } from '../../../../types/Auth';
import { textInputSX } from '../../../../util/util';
import * as Styled from './PersonalInfo.styles';

const initialValues: ChangePasswordData = {
  username: '',
  newPassword: '',
  oldPassword: '',
};

const PersonalInfo = () => {
  const { authData } = useContext(AuthContext);

  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const { showSnackbar } = useSnackbar();

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
        showSnackbar('password-changed', 'success');
        resetForm();
      } catch (error) {
        console.log(error);
        showSnackbar('Failed', 'error');
      }
    },
    [authData, showSnackbar]
  );

  const validationChangePasswordSchema = Yup.object({
    newPassword: Yup.string().required(t('validation.required.new-password')),
    oldPassword: Yup.string().required(t('validation.required.old-password')),
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
    <Styled.PersonalInfoContainer className="change-password">
      <form
        className="change-password__form"
        autoComplete="off"
        onSubmit={changePasswordFormik.handleSubmit}
      >
        <h3>{t('change-password')}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="change-password__form__input">
            {t('old-password')}
            <OutlinedInput
              id="outlined-old-password"
              className="change-password__form__input--oldPassword"
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
          <div className="change-password__form__input">
            {t('new-password')}
            <OutlinedInput
              id="outlined-new-password"
              className="change-password__form__input--newPassword"
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
          className="change-password__form__button"
          variant="contained"
          type="submit"
          disabled={isChangePasswordDisabled}
        >
          {t('change-password')}
        </Button>
      </form>
    </Styled.PersonalInfoContainer>
  );
};

export default PersonalInfo;

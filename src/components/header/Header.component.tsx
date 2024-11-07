import { Button } from '@mui/material';
import { useContext, useMemo } from 'react';
import AuthContext from '../../store/AuthProvider/Auth.context';
import * as Styled from './Header.styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChangeLanguage } from '../../hooks/useChangeLanguage';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

const HeaderComponent = () => {
  const { logout, token } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const { changeLanguage, selectedLanguage } = useChangeLanguage();

  const shouldHideLink = useMemo(
    () => location.pathname === '/login',
    [location.pathname]
  );

  return (
    <Styled.HeaderContainer className="header">
      <img src={theme.logo} alt="Logo" className="header__logo" />
      <div className="header__actions">
        <div className="header__actions__language">
          <div
            className="header__actions__language__button"
            onClick={() => changeLanguage('en')}
          >
            <img
              className={classNames('header__actions__language__button__flag', {
                'header__actions__language__button__flag--selected':
                  selectedLanguage === 'en',
              })}
              src="/en.png"
              alt="english"
            />
          </div>
          <div
            className="header__actions__language__button"
            onClick={() => changeLanguage('rs')}
          >
            <img
              className={classNames('header__actions__language__button__flag', {
                'header__actions__language__button__flag--selected':
                  selectedLanguage === 'rs',
              })}
              src="/rs.png"
              alt="serbian"
            />
          </div>
        </div>
        {shouldHideLink ? (
          <Button variant="contained" onClick={() => navigate('/')}>
            {t('home')}
          </Button>
        ) : token ? (
          <Button variant="contained" onClick={() => logout(navigate)}>
            {t('logout')}
          </Button>
        ) : (
          <Button variant="contained" onClick={() => navigate('/login')}>
            {t('go-to-login')}
          </Button>
        )}
      </div>
    </Styled.HeaderContainer>
  );
};

export default HeaderComponent;

import { Button, Menu, MenuItem } from '@mui/material';
import { useCallback, useContext, useMemo, useState } from 'react';
import AuthContext from '../../store/AuthProvider/Auth.context';
import * as Styled from './Header.styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChangeLanguage } from '../../hooks/useChangeLanguage';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

const HeaderComponent = () => {
  const { logout, token, authData } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const { changeLanguage, selectedLanguage } = useChangeLanguage();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    setAnchorEl(null);
    logout(navigate);
  }, [logout, navigate]);

  const shouldHideLink = useMemo(
    () => location.pathname === '/login',
    [location.pathname]
  );

  return (
    <Styled.HeaderContainer className="header">
      <img
        src={theme.logo}
        alt="Logo"
        className="header__logo"
        onClick={() => navigate('/')}
      />
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
          <>
            <Button
              id="user-button"
              aria-controls={open ? 'user-button' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              variant="contained"
            >
              {authData?.name}
            </Button>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'user-button',
              }}
            >
              <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button variant="contained" onClick={() => navigate('/login')}>
              {t('go-to-login')}
            </Button>
            {/* <Button variant="contained" onClick={() => navigate('/signup')}>
              {t('signup')}
            </Button> */}
          </>
        )}
      </div>
    </Styled.HeaderContainer>
  );
};

export default HeaderComponent;

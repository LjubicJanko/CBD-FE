import { Button, IconButton, Menu, MenuItem, Select } from '@mui/material';
import { useCallback, useContext, useMemo, useState } from 'react';
import AuthContext from '../../store/AuthProvider/Auth.context';
import * as Styled from './Header.styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChangeLanguage } from '../../hooks/useChangeLanguage';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import React from 'react';

const HeaderComponent = () => {
  const { logout, token, authData } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

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

  const url = useMemo(
    () => location.pathname.split('/').pop(),
    [location.pathname]
  );

  const showBackButton = useMemo(
    () => url && ['login', 'track'].includes(url),
    [url]
  );

  return (
    <Styled.HeaderContainer className="header">
      {/* <img
        src={theme.logo}
        alt="Logo"
        className="header__logo"
        onClick={() => navigate('/')}
      /> */}
      <div className="header__actions">
        {showBackButton ? (
          <>
            <IconButton
              className="header__back-btn"
              onClick={() => navigate('/')}
              edge="end"
            >
              <ChevronLeftIcon />
            </IconButton>
            <h1 className="header__actions--title">{t(`${url}-title`)}</h1>
          </>
        ) : (
          <Select
            id="language"
            value={selectedLanguage}
            className="header__actions__language"
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <MenuItem
              className="header__actions__language__menu-item"
              value="en"
            >
              <img
                className={classNames(
                  'header__actions__language__button__flag',
                  {
                    'header__actions__language__button__flag--selected':
                      selectedLanguage === 'en',
                  }
                )}
                src="/en.png"
                alt="english"
              />
            </MenuItem>
            <MenuItem
              className="header__actions__language__menu-item"
              value="rs"
            >
              <img
                className={classNames(
                  'header__actions__language__button__flag',
                  {
                    'header__actions__language__button__flag--selected':
                      selectedLanguage === 'rs',
                  }
                )}
                src="/rs.png"
                alt="serbian"
              />
            </MenuItem>
          </Select>
        )}

        {token && (
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
        )}
      </div>
    </Styled.HeaderContainer>
  );
};

export default HeaderComponent;

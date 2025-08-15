import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Button, IconButton, Menu, MenuItem, Select } from '@mui/material';
import classNames from 'classnames';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useChangeLanguage } from '../../hooks/useChangeLanguage';
import useQueryParams from '../../hooks/useQueryParams';
import useResponsiveWidth from '../../hooks/useResponsiveWidth';
import AuthContext from '../../store/AuthProvider/Auth.context';
import theme from '../../styles/theme';
import { xxsMax } from '../../util/breakpoints';
import * as Styled from './Header.styles';

const HeaderComponent = () => {
  const { logout, token, authData, companiesInfo } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const { changeLanguage, selectedLanguage } = useChangeLanguage();
  const width = useResponsiveWidth();

  const {
    params: { id },
  } = useQueryParams<{ id: string | undefined }>();
  const { id: companyId } = useParams<{ id: string }>();
  console.log(companyId);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const isOnMobile = width < xxsMax;

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

  const handleGoToProfile = useCallback(() => {
    setAnchorEl(null);
    navigate('/profile');
  }, [navigate]);

  const url = useMemo(
    () => location.pathname.split('/').pop(),
    [location.pathname]
  );

  const showBackButton = useMemo(
    () => url && ['login', 'track'].includes(url),
    [url]
  );

  const logo = useMemo(
    () => (
      <img
        src={theme.logo}
        width={50}
        alt="Logo"
        className="logo"
        onClick={() => navigate('/')}
      />
    ),
    [navigate]
  );

  if (!token) {
    return (
      <Styled.PublicHeaderContainer className="public-header">
        {showBackButton ? (
          <div className="public-header__with-back-btn">
            <IconButton
              className="public-header__with-back-btn--btn"
              onClick={() => navigate(id ? '/track' : '/')}
              edge="end"
            >
              <ChevronLeftIcon />
            </IconButton>
            <h1 className="public-header__with-back-btn--title">
              {t(`${url}-title`)}
            </h1>
            {!isOnMobile && logo}
          </div>
        ) : (
          <Select
            id="language"
            value={selectedLanguage}
            className="public-header__language"
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <MenuItem className="public-header__language__menu-item" value="en">
              <img
                className={classNames('public-header__language__button__flag', {
                  'public-header__language__button__flag--selected':
                    selectedLanguage === 'en',
                })}
                src="/en.png"
                alt="english"
              />
            </MenuItem>
            <MenuItem className="public-header__language__menu-item" value="rs">
              <img
                className={classNames('public-header__language__button__flag', {
                  'public-header__language__button__flag--selected':
                    selectedLanguage === 'rs',
                })}
                src="/rs.png"
                alt="serbian"
              />
            </MenuItem>
          </Select>
        )}
      </Styled.PublicHeaderContainer>
    );
  }

  // console.log(authData);

  return (
    <Styled.HeaderContainer className="header">
      {/* <Select
        id="language"
        value={selectedLanguage}
        className="header__language"
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <MenuItem className="header__language__menu-item" value="en">
          <img
            className={classNames('header__language__button__flag', {
              'header__language__button__flag--selected':
                selectedLanguage === 'en',
            })}
            src="/en.png"
            alt="english"
          />
        </MenuItem>
        <MenuItem className="header__language__menu-item" value="rs">
          <img
            className={classNames('header__language__button__flag', {
              'header__language__button__flag--selected':
                selectedLanguage === 'rs',
            })}
            src="/rs.png"
            alt="serbian"
          />
        </MenuItem>
      </Select> */}
      <Select
        id="companies"
        className="header__companies-menu"
        value={companyId}
        onChange={(e) => {
          console.log(e);
        }}
      >
        {companiesInfo?.map((company) => (
          <MenuItem className="header__companies-menu__item" value={+company.id}>
            {company.name}
          </MenuItem>
        ))}
      </Select>
      {logo}
      <Button
        id="user-button"
        className="user-button"
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
        className="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'user-button',
        }}
      >
        <MenuItem className="user-menu__item" onClick={handleGoToProfile}>
          {t('profile')}
          <PersonIcon />
        </MenuItem>
        <MenuItem className="user-menu__item" onClick={handleLogout}>
          {t('logout')}
          <LogoutIcon />
        </MenuItem>
      </Menu>
    </Styled.HeaderContainer>
  );
};

export default HeaderComponent;

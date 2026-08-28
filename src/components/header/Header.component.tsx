import { Button, FormControl, IconButton, Menu, MenuItem, Select } from '@mui/material';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AuthContext from '../../store/AuthProvider/Auth.context';
import * as Styled from './Header.styles';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useChangeLanguage } from '../../hooks/useChangeLanguage';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import React from 'react';
import theme from '../../styles/theme';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import MenuIcon from '@mui/icons-material/Menu';
import ShareButton from '../share-button/ShareButton.component';
import AttendanceButton from '../attendance-button/AttendanceButton.component';
import { platformService, publicTenantService } from '../../api';
import { getLogoAbsoluteUrl, Tenant } from '../../api/services/platform';
import { PublicTenant } from '../../api/services/publicTenant';
import localStorageService from '../../services/localStorage.service';
import { usePrivileges } from '../../hooks/usePrivileges';
import { useHasFeature } from '../../hooks/useFeatures';
import { Feature, firstEnabledModuleRoute } from '../../util/features';
import { isReservedSlug } from '../../util/reservedSlugs';

const HeaderComponent = () => {
  const { logout, token, authData } = useContext(AuthContext);
  const { canCheckIn, canViewAttendance, canManageLocations } = usePrivileges();
  const hasReports = useHasFeature(Feature.REPORTS);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const { changeLanguage, selectedLanguage } = useChangeLanguage();
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [ownTenant, setOwnTenant] = useState<PublicTenant | null>(null);
  // Features of the public tenant whose home page we're on (null until known).
  // Drives whether the header shows its Login button: a tenant with no public
  // module renders the branded login prompt in the home BODY, so the header
  // button would be a redundant second login affordance.
  const [publicHomeFeatures, setPublicHomeFeatures] = useState<string[] | null>(
    null
  );
  // Reads localStorage synchronously rather than reactively. That's fine here:
  // tenant switches in this app always trigger a hard navigation
  // (window.location.href = '/dashboard'), so this component remounts on the
  // next page and re-reads the storage. If a future change introduces
  // SPA-style tenant switching, lift selectedTenantId/Slug into a context
  // first, otherwise the dropdown will desync.
  // Same constraint applies in BannerProvider and TenantContextRequired.
  const [selectedTenantId, setSelectedTenantId] = useState<number | ''>(
    localStorageService.selectedTenantId ?? ''
  );

  useEffect(() => {
    if (authData?.superadmin) {
      platformService.getTenants().then(setTenants).catch(console.error);
    } else if (authData?.tenantSlug) {
      publicTenantService
        .getTenantBySlug(authData.tenantSlug)
        .then(setOwnTenant)
        .catch(console.error);
    }
  }, [authData?.superadmin, authData?.tenantSlug]);

  // Self-heal when the currently-selected tenant disappears from the list
  // (deactivated, deleted, or never existed). Catches both "superadmin
  // deactivated the tenant they're impersonating" and the stale-localStorage
  // case. Runs whenever the fetched tenants list changes.
  useEffect(() => {
    if (!authData?.superadmin) return;
    if (tenants.length === 0) return;
    if (selectedTenantId === '') return;
    const current = tenants.find((tenant) => tenant.id === selectedTenantId);
    if (!current || !current.active) {
      localStorageService.clearSelectedTenant();
      window.location.href = '/select-tenant';
    }
  }, [tenants, selectedTenantId, authData?.superadmin]);

  const handleTenantSwitch = useCallback(
    (tenantId: number) => {
      const switchedTo = tenants.find((tenant) => tenant.id === tenantId);
      const features = switchedTo?.features ?? [];
      setSelectedTenantId(tenantId);
      localStorageService.setSelectedTenant(
        tenantId,
        switchedTo?.slug ?? null,
        features,
        {
          accentColor: switchedTo?.accentColor ?? null,
          backgroundColor: switchedTo?.backgroundColor ?? null,
        }
      );
      // Hard navigation: drops in-memory caches (OrdersProvider, fetched lists)
      // that are scoped to the previous tenant. Land on the tenant's first
      // enabled module (usually /dashboard), consistent with /select-tenant.
      window.location.href = firstEnabledModuleRoute(features);
    },
    [tenants]
  );

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    setAnchorEl(null);
    logout();
  }, [logout]);

  const handleGoToProfile = useCallback(() => {
    setAnchorEl(null);
    navigate('/profile');
  }, [navigate]);

  const handleGoToReports = useCallback(() => {
    setAnchorEl(null);
    navigate('/reports');
  }, [navigate]);

  const handleGoToPlatform = useCallback(() => {
    setAnchorEl(null);
    navigate('/platform');
  }, [navigate]);

  const handleGoToAttendance = useCallback(() => {
    setAnchorEl(null);
    navigate('/attendance');
  }, [navigate]);

  const url = useMemo(
    () => location.pathname.split('/').pop(),
    [location.pathname]
  );

  const showBackButton = useMemo(
    () =>
      location.pathname.startsWith('/login') ||
      location.pathname.startsWith('/track') ||
      location.pathname.startsWith('/order-extension'),
    [location.pathname]
  );

  // Only the public home route shows the header Login button (no back button).
  // There, resolve the tenant's features so we can hide the button when the home
  // body already shows its own login prompt (tenant with no public module).
  useEffect(() => {
    if (token || showBackButton || !tenantSlug || isReservedSlug(tenantSlug)) {
      setPublicHomeFeatures(null);
      return;
    }
    let cancelled = false;
    publicTenantService
      .getTenantBySlug(tenantSlug)
      .then((tn) => {
        if (!cancelled) setPublicHomeFeatures(tn.features);
      })
      .catch(() => {
        if (!cancelled) setPublicHomeFeatures(null);
      });
    return () => {
      cancelled = true;
    };
  }, [token, showBackButton, tenantSlug]);

  // Show the header Login on the home route EXCEPT when we know the tenant has
  // no public module (then the body owns the login prompt). Default to showing
  // it while unknown/loading and on the slugless legacy home.
  const showHeaderLogin =
    !tenantSlug ||
    publicHomeFeatures === null ||
    publicHomeFeatures.includes(Feature.ORDERS) ||
    publicHomeFeatures.includes(Feature.ORDER_EXTENSION);

  const titleKey = useMemo(() => {
    if (location.pathname.startsWith('/order-extension')) {
      return 'order-extension';
    }
    if (location.pathname.startsWith('/track')) {
      return 'track';
    }
    if (location.pathname.startsWith('/login')) {
      return 'login';
    }
    return url;
  }, [location.pathname, url]);

  const activeTenantLogoPath = useMemo(() => {
    if (authData?.superadmin) {
      const activeTenant = tenants.find((t) => t.id === selectedTenantId);
      return activeTenant?.logoUrl ?? null;
    }
    return authData?.tenantLogoUrl ?? null;
  }, [authData?.superadmin, authData?.tenantLogoUrl, tenants, selectedTenantId]);

  const [logoLoadFailed, setLogoLoadFailed] = useState(false);

  const tenantLogoUrl = useMemo(
    () => getLogoAbsoluteUrl(activeTenantLogoPath),
    [activeTenantLogoPath]
  );

  useEffect(() => {
    setLogoLoadFailed(false);
  }, [tenantLogoUrl]);

  const useTenantLogo = Boolean(tenantLogoUrl) && !logoLoadFailed;
  const logoSrc = useTenantLogo ? (tenantLogoUrl as string) : theme.logo;

  const logo = useMemo(
    () => (
      <img
        src={logoSrc}
        width={50}
        alt="Logo"
        className={classNames('logo', { 'logo--tenant': useTenantLogo })}
        onClick={() => navigate('/')}
        onError={() => setLogoLoadFailed(true)}
      />
    ),
    [navigate, logoSrc, useTenantLogo]
  );

  if (!token) {
    return (
      <Styled.PublicHeaderContainer className="public-header">
        {showBackButton ? (
          <div className="public-header__with-back-btn">
            <IconButton
              className="public-header__with-back-btn--btn"
              onClick={() => navigate(tenantSlug ? `/${tenantSlug}` : '/')}
              edge="end"
            >
              <ChevronLeftIcon />
            </IconButton>
            <h1 className="public-header__with-back-btn--title">
              {t(`${titleKey}-title`)}
            </h1>
            <ShareButton />
          </div>
        ) : (
          <div className="public-header__home">
            <Select
              id="language"
              value={selectedLanguage}
              className="public-header__language"
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <MenuItem
                className="public-header__language__menu-item"
                value="en"
              >
                <img
                  className={classNames(
                    'public-header__language__button__flag',
                    {
                      'public-header__language__button__flag--selected':
                        selectedLanguage === 'en',
                    }
                  )}
                  src="/en.png"
                  alt="english"
                />
              </MenuItem>
              <MenuItem
                className="public-header__language__menu-item"
                value="rs"
              >
                <img
                  className={classNames(
                    'public-header__language__button__flag',
                    {
                      'public-header__language__button__flag--selected':
                        selectedLanguage === 'rs',
                    }
                  )}
                  src="/rs.png"
                  alt="serbian"
                />
              </MenuItem>
            </Select>

            {showHeaderLogin && (
              <Button
                variant="outlined"
                className="public-header__home__login-btn"
                onClick={() =>
                  navigate(tenantSlug ? `/login/${tenantSlug}` : '/login')
                }
              >
                {t('login')}
              </Button>
            )}
          </div>
        )}
      </Styled.PublicHeaderContainer>
    );
  }

  const renderTenantSlot = () => {
    if (authData?.superadmin) {
      const activeTenants = tenants.filter((tenant) => tenant.active);
      if (activeTenants.length === 0 || selectedTenantId === '') return null;
      return (
        <FormControl size="small">
          <Select<number | ''>
            className="header__tenant__select"
            value={selectedTenantId}
            onChange={(e) => {
              const value = e.target.value;
              if (typeof value === 'number') handleTenantSwitch(value);
            }}
          >
            {activeTenants.map((tenant) => (
              <MenuItem key={tenant.id} value={tenant.id}>
                {tenant.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
    if (!authData?.tenantSlug) return null;
    return (
      <span className="header__tenant__name">
        {ownTenant?.name ?? authData.tenantSlug}
      </span>
    );
  };

  const tenantSlot = renderTenantSlot();

  return (
    <Styled.HeaderContainer className="header">
      {tenantSlot && <div className="header__tenant">{tenantSlot}</div>}
      {logo}
      <div className="header__right">
        <AttendanceButton />
        <IconButton
          id="user-button"
          className="header__menu-btn"
          aria-controls={open ? 'user-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
      </div>
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
        <div className="user-menu__language">
          <IconButton
            className={classNames('user-menu__language__btn', {
              'user-menu__language__btn--selected': selectedLanguage === 'en',
            })}
            onClick={() => { changeLanguage('en'); }}
          >
            <img src="/en.png" alt="english" className="user-menu__language__flag" />
          </IconButton>
          <IconButton
            className={classNames('user-menu__language__btn', {
              'user-menu__language__btn--selected': selectedLanguage === 'rs',
            })}
            onClick={() => { changeLanguage('rs'); }}
          >
            <img src="/rs.png" alt="serbian" className="user-menu__language__flag" />
          </IconButton>
        </div>
        <MenuItem className="user-menu__item" onClick={handleGoToProfile}>
          {t('settings')}
          <SettingsIcon />
        </MenuItem>
        {hasReports && (
          <MenuItem className="user-menu__item" onClick={handleGoToReports}>
            {t('reports')}
            <AssessmentIcon />
          </MenuItem>
        )}
        {(canCheckIn || canViewAttendance || canManageLocations) && (
          <MenuItem
            className="user-menu__item"
            onClick={handleGoToAttendance}
          >
            {t('attendance.menu')}
            <HowToRegIcon />
          </MenuItem>
        )}
        {authData?.superadmin && (
          <MenuItem className="user-menu__item" onClick={handleGoToPlatform}>
            {t('platform.title')}
            <AdminPanelSettingsIcon />
          </MenuItem>
        )}
        <MenuItem className="user-menu__item" onClick={handleLogout}>
          {t('logout')}
          <LogoutIcon />
        </MenuItem>
      </Menu>
    </Styled.HeaderContainer>
  );
};

export default HeaderComponent;

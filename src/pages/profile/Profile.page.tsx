import {
    Button,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import CampaignIcon from '@mui/icons-material/Campaign';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import classNames from 'classnames';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import * as Styled from './Profile.styles';
import PersonalInfo from './components/personal-info/PersonalInfo.component';
import AddUser from './components/add-user/AddUser.component';
import ShareLink from './components/share-link/ShareLink.component';
import TenantDetails from './components/tenant-details/TenantDetails.component';
import { BannerPage } from '../banner/Banner.page';
import { useIsCompanyAdmin } from '../../hooks/useRole';
import useResponsiveWidth from '../../hooks/useResponsiveWidth';
import { xxsMax } from '../../util/breakpoints';

type ProfileCard =
    | 'personal-info'
    | 'tenant-details'
    | 'add-user'
    | 'banners'
    | 'share';

type Tab = {
    id: ProfileCard;
    label: string;
    icon: ReactNode;
    panel: ReactNode;
};

type TabGroup = {
    id: string;
    label: string;
    tabs: Tab[];
};

const ProfilePage = () => {
    const { t } = useTranslation();
    const width = useResponsiveWidth();
    const isMobile = width < xxsMax;

    const [searchParams, setSearchParams] = useSearchParams();

    const isAdmin = useIsCompanyAdmin();

    // Single source of truth for the sidebar, the mobile dropdown and the
    // panel content. Tabs are organised into groups: everything except
    // "Personal info" is tenant-scoped, so it lives under "Company".
    const groups = useMemo<TabGroup[]>(
        () => [
            {
                id: 'account',
                label: t('profile-group-account'),
                tabs: [
                    {
                        id: 'personal-info',
                        label: t('personal-info'),
                        icon: <PersonIcon fontSize="small" />,
                        panel: <PersonalInfo />,
                    },
                ],
            },
            ...(isAdmin
                ? [
                      {
                          id: 'company',
                          label: t('profile-group-company'),
                          tabs: [
                              {
                                  id: 'tenant-details' as const,
                                  label: t('tenantDetails.tab'),
                                  icon: <BusinessIcon fontSize="small" />,
                                  panel: <TenantDetails />,
                              },
                              {
                                  id: 'add-user' as const,
                                  label: t('users-tab'),
                                  icon: <GroupIcon fontSize="small" />,
                                  panel: <AddUser />,
                              },
                              {
                                  id: 'banners' as const,
                                  label: t('banners'),
                                  icon: <CampaignIcon fontSize="small" />,
                                  panel: <BannerPage />,
                              },
                              {
                                  id: 'share' as const,
                                  label: t('share.tab'),
                                  icon: <QrCode2Icon fontSize="small" />,
                                  panel: <ShareLink />,
                              },
                          ],
                      },
                  ]
                : []),
        ],
        [isAdmin, t]
    );

    const allTabs = useMemo(
        () => groups.flatMap((group) => group.tabs),
        [groups]
    );

    // Active tab is driven by the `tab` query param (its id) so a refresh or
    // shared link lands on the same tab. Falls back to the first tab when the
    // param is missing or names a tab this user can't access (e.g. a non-admin
    // with a stale admin-tab link).
    const paramId = searchParams.get('tab');
    const selectedCard =
        allTabs.find((tab) => tab.id === paramId)?.id ?? allTabs[0].id;

    const selectCard = (id: ProfileCard) => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.set('tab', id);
                return next;
            },
            { replace: true }
        );
    };

    const activePanel = allTabs.find((tab) => tab.id === selectedCard)?.panel;

    return (
        <Styled.ProfilePageContainer className="profile">
            <div className="profile__cards">
                <h3>{t('settings')}</h3>
                {isMobile ? (
                    <Select
                        className="profile__tab-select"
                        value={selectedCard}
                        onChange={(e: SelectChangeEvent<ProfileCard>) =>
                            selectCard(e.target.value as ProfileCard)
                        }
                        size="small"
                        fullWidth
                    >
                        {allTabs.map((tab) => (
                            <MenuItem key={tab.id} value={tab.id}>
                                {tab.label}
                            </MenuItem>
                        ))}
                    </Select>
                ) : (
                    groups.map((group) => (
                        <div key={group.id} className="profile__group">
                            <span className="profile__group-label">
                                {group.label}
                            </span>
                            {group.tabs.map((tab) => (
                                <Button
                                    key={tab.id}
                                    id={tab.id}
                                    className={classNames('profile__tab', {
                                        selected: selectedCard === tab.id,
                                    })}
                                    startIcon={tab.icon}
                                    onClick={() => selectCard(tab.id)}
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div>
                    ))
                )}
            </div>
            <div className="profile__panel">{activePanel}</div>
        </Styled.ProfilePageContainer>
    );
};

export default ProfilePage;

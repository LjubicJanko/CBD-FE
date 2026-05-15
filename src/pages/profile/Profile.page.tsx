import { Button } from '@mui/material';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Styled from './Profile.styles';
import PersonalInfo from './components/personal-info/PersonalInfo.component';
import AddUser from './components/add-user/AddUser.component';
import ShareLink from './components/share-link/ShareLink.component';
import { BannerPage } from '../banner/Banner.page';
import { useIsCompanyAdmin } from '../../hooks/useRole';

const ProfilePage = () => {
    const { t } = useTranslation();
    const [selectedCard, setSelectedCard] = useState<
        'personal-info' | 'add-user' | 'banners' | 'share'
    >('personal-info');

    const isAdmin = useIsCompanyAdmin();

    const components = useMemo(
        () => ({
            'personal-info': <PersonalInfo />,
            ...(isAdmin ? { 'add-user': <AddUser /> } : {}),
            ...(isAdmin ? { banners: <BannerPage /> } : {}),
            ...(isAdmin ? { share: <ShareLink /> } : {}),
        }),
        [isAdmin]
    );

    return (
        <Styled.ProfilePageContainer className="profile">
            <div className="profile__cards">
                <h3>{t('settings')}</h3>
                <Button
                    id="personal-info"
                    className={classNames({
                        selected: selectedCard === 'personal-info',
                    })}
                    onClick={() => setSelectedCard('personal-info')}
                >
                    {t('personal-info')}
                </Button>
                {isAdmin && (
                    <Button
                        id="add-user"
                        className={classNames({
                            selected: selectedCard === 'add-user',
                        })}
                        onClick={() => setSelectedCard('add-user')}
                    >
                        {t('add-user')}
                    </Button>
                )}
                {isAdmin && (
                    <Button
                        id="banners"
                        className={classNames({
                            selected: selectedCard === 'banners',
                        })}
                        onClick={() => setSelectedCard('banners')}
                    >
                        {t('Baneri')}
                    </Button>
                )}
                {isAdmin && (
                    <Button
                        id="share"
                        className={classNames({
                            selected: selectedCard === 'share',
                        })}
                        onClick={() => setSelectedCard('share')}
                    >
                        {t('share.tab')}
                    </Button>
                )}
            </div>
            <div className="profile__panel">{components[selectedCard]}</div>
        </Styled.ProfilePageContainer>
    );
};

export default ProfilePage;

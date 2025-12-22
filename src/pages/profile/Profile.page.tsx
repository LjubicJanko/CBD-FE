import { Button } from '@mui/material';
import classNames from 'classnames';
import { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Styled from './Profile.styles';
import PersonalInfo from './components/personal-info/PersonalInfo.component';
import AuthContext from '../../store/AuthProvider/Auth.context';
import AddUser from './components/add-user/AddUser.component';
import { BannerPage } from '../banner/Banner.page';

const ProfilePage = () => {
    const { t } = useTranslation();
    const { authData } = useContext(AuthContext);
    const [selectedCard, setSelectedCard] = useState<
        'personal-info' | 'add-user' | 'banners'
    >('personal-info');
    const { roles: userRoles } = authData ?? {};

    const isAdmin = userRoles?.includes('admin');

    const components = useMemo(
        () => ({
            'personal-info': <PersonalInfo />,
            ...(isAdmin ? { 'add-user': <AddUser /> } : {}),
            ...(isAdmin ? { banners: <BannerPage /> } : {}),
        }),
        [isAdmin]
    );

    return (
        <Styled.ProfilePageContainer className="profile">
            <div className="profile__cards">
                <h3>{t('profile')}</h3>
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
            </div>
            <div className="profile__panel">{components[selectedCard]}</div>
        </Styled.ProfilePageContainer>
    );
};

export default ProfilePage;

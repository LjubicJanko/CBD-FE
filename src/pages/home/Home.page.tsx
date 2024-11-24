import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Styled from './Home.styles';
import theme from '../../styles/theme';

const HomeComponent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Styled.HomeContainer className="home">
      <img src={theme.logo} />
      <span className="home__title">{t('CBD SPORTSWEAR')}</span>
      <div className="home__actions">
        <Button
          variant="outlined"
          className="home__actions__login-btn"
          onClick={() => navigate('/login')}
        >
          {t('Uloguj se')}
        </Button>
        <Button
          variant="outlined"
          className="home__actions__track-btn"
          onClick={() => navigate('/track')}
        >
          {t('ID praćenje')}
        </Button>
      </div>
    </Styled.HomeContainer>
  );
};

export default HomeComponent;

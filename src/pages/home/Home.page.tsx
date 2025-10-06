import * as Styled from './Home.styles';
import Section from '../../components/section/Section.component';
import { useTranslation } from 'react-i18next';
import {IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';


const HomeComponent = () => {
  const { t } = useTranslation();

  return (
    <Styled.HomeContainer className="home">
      <Section
        title={t('Poruči dres')}
        to="/order-extension"
        panelClassName="home__order-panel"
      />
      <Section
        title={t('ID Praćenje')}
        to="/track"
        panelClassName="home__tracking-panel"
      />
      <IconButton
        className="home__instagram"
        onClick={() =>
          window.open(
            'https://www.instagram.com/cbd_sportswear',
            '_blank'
          )
        }
      >
        <InstagramIcon />
        <p>{t('@cbd_sportswear')}</p>
      </IconButton>
    </Styled.HomeContainer>
  );
};

export default HomeComponent;

import * as Styled from './Home.styles';
import Section from '../../components/section/Section.component';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

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
      <Button
        variant="text"
        className="home__instagram"
        startIcon={<img src="instagram_icon.png" />}
      >
        @cbd_sportswear
      </Button>
    </Styled.HomeContainer>
  );
};

export default HomeComponent;

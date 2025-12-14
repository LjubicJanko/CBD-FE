import { useTranslation } from 'react-i18next';
import Section from '../../components/section/Section.component';
import * as Styled from './Home.styles';
import PageBanner from '../../components/page-banner/PageBanner.component';

const HomeComponent = () => {
    const { t } = useTranslation();

    return (
        <Styled.HomeContainer className="home">
            <PageBanner page="HOME" />
            <div className="home__sections">
                <Section
                    title={t('Poruči dres')}
                    to="/order-extension"
                    panelClassName="home__sections__order-panel"
                />
                <Section
                    title={t('ID Praćenje')}
                    to="/track"
                    panelClassName="home__sections__tracking-panel"
                />
            </div>
        </Styled.HomeContainer>
    );
};

export default HomeComponent;

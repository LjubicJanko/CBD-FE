import { useContext } from 'react';
import BannerContext from '../../store/BannerProvider/Banner.context';
import { BannerLocation } from '../../types/Banner';
import * as Styled from './PageBanner.styles';

type PageBannerProps = { page: BannerLocation };

const PageBanner = ({ page }: PageBannerProps) => {
    const { activeBanner, dismissed, dismissBanner } =
        useContext(BannerContext);

    if (!activeBanner || !activeBanner.activePages.includes(page)) return null;
    if (dismissed[page]) return null;

    return (
        <Styled.PageBannerContainer className="banner">
            <h2>{activeBanner.title}</h2>
            <p>{activeBanner.text}</p>
            <button onClick={() => dismissBanner(page)}>X</button>
        </Styled.PageBannerContainer>
    );
};

export default PageBanner;

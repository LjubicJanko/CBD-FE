import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import BannerContext, { BannerContextType } from './Banner.context';
import { Banner, BannerLocation } from '../../types/Banner';
import { bannerService } from '../../api';

// const PAGES: BannerLocation[] = ['HOME', 'ID_TRACKING', 'ORDER'];

const BannerProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [activeBanner, setActiveBanner] = useState<Banner | null>(null);

    const [dismissed, setDismissed] = useState<Record<BannerLocation, boolean>>(
        { HOME: false, ID_TRACKING: false, ORDER: false }
    );
    // const [dismissed, setDismissed] = useState<Record<BannerLocation, boolean>>(
    //     () => {
    //         const initial: Record<BannerLocation, boolean> = {} as Record<
    //             BannerLocation,
    //             boolean
    //         >;
    //         PAGES.forEach((page) => {
    //             initial[page] = localStorageService.getBannerDismissed(page);
    //         });
    //         return initial;
    //     }
    // );

    const fetchBanner = useCallback(async () => {
        try {
            const activeBanner: Banner = await bannerService.getActive();
            setActiveBanner(activeBanner);
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        }
    }, []);

    const dismissBanner = useCallback((page: BannerLocation) => {
        setDismissed((prev) => {
            const updated = { ...prev, [page]: true };
            // localStorageService.setBannerDismissed(page, true);
            return updated;
        });
        // setDismissed(true);
    }, []);

    useEffect(() => {
        fetchBanner();
    }, [fetchBanner]);

    const contextValue: BannerContextType = {
        activeBanner,
        dismissed,
        dismissBanner,
    };

    return (
        <BannerContext.Provider value={contextValue}>
            {children}
        </BannerContext.Provider>
    );
};

export default BannerProvider;

import { createContext } from 'react';
import { Banner, BannerLocation } from '../../types/Banner';

export interface BannerContextType {
  activeBanner: Banner | null;
  dismissed: Record<BannerLocation, boolean>;
  dismissBanner: (page: BannerLocation) => void;
}

export default createContext<BannerContextType>({
  activeBanner: null,
  dismissed: { HOME: false, ID_TRACKING: false, ORDER: false },
  dismissBanner: () => {},
});

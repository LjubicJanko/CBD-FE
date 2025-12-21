export type BannerLocation = 'HOME' | 'ID_TRACKING' | 'ORDER';

export type Banner = {
    id: number;
    title: string;
    text: string;
    activePages: BannerLocation[];
    // visible: boolean;
    // locations: BannerLocation[];
};

export type CreateBannerData = {
    title: string;
    text: string;
};

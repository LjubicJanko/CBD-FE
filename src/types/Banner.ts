export type BannerLocation = 'HOME' | 'ID_TRACKING' | 'ORDER';

export enum BannerLocationEnum {
  HOME = 'HOME',
  ID_TRACKING = 'ID_TRACKING',
  ORDER = 'ORDER',
}

export type Banner = {
    id: number;
    title: string;
    text: string;
    activePages: BannerLocation[];
};

export type CreateBannerData = {
    title: string;
    text: string;
};

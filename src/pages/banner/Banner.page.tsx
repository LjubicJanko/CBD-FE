import { useCallback, useEffect, useState } from 'react';
import * as Styled from './BannerPage.styles';
import { Banner, BannerLocation, CreateBannerData } from '../../types/Banner';
import { BannerCard } from '../../components';
import { Button } from '@mui/material';
import BannerModal from '../../components/modals/banner-modal/Banner.modal';
import AddIcon from '@mui/icons-material/Add';
import { bannerService } from '../../api';

type BannerModalConfig = {
    isOpen: boolean;
    banner?: Banner;
};

const EMPTY_BANNER_MODAL_CONFIG = {
    isOpen: false,
};

export const BannerPage = () => {
    const [bannerModalConfig, setBannerModalConfig] =
        useState<BannerModalConfig>(EMPTY_BANNER_MODAL_CONFIG);
    const [banners, setBanners] = useState<Banner[]>([]);

    const fetchBanners = useCallback(async () => {
        try {
            const response = await bannerService.getAll();
            setBanners(response);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const deleteBanner = useCallback(async (bannerId: number) => {
        try {
            await bannerService.deleteBanner(bannerId);
            setBanners((old) =>
                old.filter((_banner) => _banner.id !== bannerId)
            );
        } catch (error) {
            console.error(error);
        }
    }, []);

    const publishBanner = useCallback(
        async (bannerId: number) => {
            try {
                const locations: BannerLocation[] = ['HOME', 'ORDER'];
                await bannerService.publishBanner(bannerId, locations);
                fetchBanners();
            } catch (error) {
                console.error(error);
            }
        },
        [fetchBanners]
    );

	const unpublishBanner = useCallback(	
		async (bannerId: number) => {
			try {
				await bannerService.unpublishBanner(bannerId);
				fetchBanners();
			} catch (error) {
				console.error(error);
			}
		},
		[fetchBanners]
	);	

    const handleCreateBanner = useCallback(
        async (createBannerData: CreateBannerData) => {
            try {
                const res: Banner = await bannerService.createBanner(
                    createBannerData
                );
                setBanners((old) => [...old, res]);
            } catch (error) {
                console.error(error);
            } finally {
                setBannerModalConfig(EMPTY_BANNER_MODAL_CONFIG);
            }
        },
        []
    );

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    return (
        <Styled.BannerPageContainer className="banners-page">
            <div className="banners-page__heading">
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setBannerModalConfig({ isOpen: true })}
                    className="banners-page__heading__add-button"
                >
                    Add banner
                </Button>
            </div>
            <div className="banners-page__content">
                {banners.map((banner) => (
                    <BannerCard
                        banner={banner}
                        onEdit={() =>
                            setBannerModalConfig({
                                isOpen: true,
                                banner: banner,
                            })
                        }
                        onDelete={() => deleteBanner(banner.id)}
                        onPublish={() => publishBanner(banner.id)}
						onUnpublish={() => unpublishBanner(banner.id)}
                    />
                ))}
            </div>
            {bannerModalConfig.isOpen && (
                <BannerModal
                    isOpen={bannerModalConfig.isOpen}
                    onConfirm={handleCreateBanner}
                    onCancel={() =>
                        setBannerModalConfig(EMPTY_BANNER_MODAL_CONFIG)
                    }
                />
            )}
        </Styled.BannerPageContainer>
    );
};

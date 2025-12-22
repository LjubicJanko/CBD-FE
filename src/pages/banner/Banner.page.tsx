import { useCallback, useEffect, useState } from 'react';
import * as Styled from './BannerPage.styles';
import { Banner, BannerLocation, CreateBannerData } from '../../types/Banner';
import { BannerCard } from '../../components';
import { Button } from '@mui/material';
import BannerModal from '../../components/modals/banner-modal/Banner.modal';
import AddIcon from '@mui/icons-material/Add';
import { bannerService } from '../../api';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useTranslation } from 'react-i18next';

type BannerModalConfig = {
    isOpen: boolean;
    banner?: Banner;
};

const EMPTY_BANNER_MODAL_CONFIG = {
    isOpen: false,
};

export const BannerPage = () => {
    const { t } = useTranslation();

    const [bannerModalConfig, setBannerModalConfig] =
        useState<BannerModalConfig>(EMPTY_BANNER_MODAL_CONFIG);
    const [banners, setBanners] = useState<Banner[]>([]);

    const { showSnackbar } = useSnackbar();

    const fetchBanners = useCallback(async () => {
        try {
            const response = await bannerService.getAll();
            setBanners(response);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const deleteBanner = useCallback(
        async (bannerId: number) => {
            try {
                await bannerService.deleteBanner(bannerId);
                setBanners((old) =>
                    old.filter((_banner) => _banner.id !== bannerId)
                );
                showSnackbar(t('Banner successfuly deleted'), 'success');
            } catch (error) {
                console.error(error);
            }
        },
        [showSnackbar, t]
    );

    const publishBanner = useCallback(
        async (bannerId: number, bannerLocations: BannerLocation[]) => {
            try {
                await bannerService.publishBanner(bannerId, bannerLocations);
                showSnackbar(t('Banner successfuly published'), 'success');
                fetchBanners();
            } catch (error) {
                console.error(error);
            }
        },
        [fetchBanners, showSnackbar, t]
    );

    const unpublishBanner = useCallback(
        async (bannerId: number) => {
            try {
                await bannerService.unpublishBanner(bannerId);
                showSnackbar(t('Banner successfuly unpublished'), 'success');
                fetchBanners();
            } catch (error) {
                console.error(error);
            }
        },
        [fetchBanners, showSnackbar, t]
    );

    const handleCreateBanner = useCallback(
        async (createBannerData: CreateBannerData) => {
            try {
                const res: Banner = await bannerService.createBanner(
                    createBannerData
                );
                setBanners((old) => [...old, res]);
                showSnackbar(t('Banner successfuly created'), 'success');
            } catch (error) {
                console.error(error);
            } finally {
                setBannerModalConfig(EMPTY_BANNER_MODAL_CONFIG);
            }
        },
        [showSnackbar, t]
    );

    const handleEditBanner = useCallback(
        async (editBannerData: CreateBannerData) => {
            try {
                if (!bannerModalConfig.banner) return;
                const res: Banner = await bannerService.editBanner(
                    bannerModalConfig.banner.id,
                    editBannerData
                );
                setBanners((old) =>
                    old.map((banner) => (banner.id === res.id ? res : banner))
                );
                showSnackbar(t('Banner successfuly edited'), 'success');
            } catch (error) {
                console.error(error);
            } finally {
                setBannerModalConfig(EMPTY_BANNER_MODAL_CONFIG);
            }
        },
        [bannerModalConfig.banner, showSnackbar, t]
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
                        onPublish={(bannerLocations: BannerLocation[]) =>
                            publishBanner(banner.id, bannerLocations)
                        }
                        onUnpublish={() => unpublishBanner(banner.id)}
                    />
                ))}
            </div>
            {bannerModalConfig.isOpen && (
                <BannerModal
                    isOpen={bannerModalConfig.isOpen}
                    banner={bannerModalConfig.banner}
                    onCreate={handleCreateBanner}
                    onEdit={handleEditBanner}
                    onCancel={() =>
                        setBannerModalConfig(EMPTY_BANNER_MODAL_CONFIG)
                    }
                />
            )}
        </Styled.BannerPageContainer>
    );
};

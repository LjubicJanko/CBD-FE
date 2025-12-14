import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import { Button, Chip } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Banner, BannerLocation } from '../../types/Banner';
import ConfirmModal from '../modals/confirm-modal/ConfirmModal.component';
import * as Styled from './BannerCard.styes';
import MobileOffIcon from '@mui/icons-material/MobileOff';
import PublishBanner from '../modals/publish-banner-modal';
import classNames from 'classnames';

export interface BannerCardProps {
    banner: Banner;
    onEdit: () => void;
    onDelete: () => void;
    onPublish: (bannerLocations: BannerLocation[]) => void;
    onUnpublish: () => void;
}

const EMPTY_MODAL_CONFIG = {
    isOpen: false,
    onConfirm: () => {},
    text: '',
};

const BannerCard = ({
    banner,
    onEdit,
    onDelete,
    onPublish,
    onUnpublish,
}: BannerCardProps) => {
    const { t } = useTranslation();

    const [confirmModalConfig, setConfirmModalConfig] =
        useState(EMPTY_MODAL_CONFIG);
    const [publishModalOpen, setPublishModalOpen] = useState(false);

    const isPublished = useMemo(
        () => banner.activePages.length > 0,
        [banner.activePages.length]
    );

    return (
        <Styled.BannerCardContainer className={
            classNames("banner-card", {
                "banner-card--unpublished": !isPublished,
            })
        }>
            <div className="banner-card__header">
                {banner.activePages.length > 0 ? (
                    <MobileFriendlyIcon
                        className="banner-card__header--published"
                        fontSize="small"
                    />
                ) : (
                    <MobileOffIcon
                        className="banner-card__header--unpublished"
                        fontSize="small"
                    />
                )}
                <div className="banner-card__header__actions">
                    <Button
                        className="banner-card__header__actions--edit"
                        onClick={onEdit}
                        size="small"
                    >
                        <EditIcon fontSize="small" />
                    </Button>
                    <Button
                        className="banner-card__header__actions--delete"
                        onClick={() =>
                            setConfirmModalConfig({
                                isOpen: true,
                                text: t('Da li si siguran da želiš da obrišeš baner?'),
                                onConfirm: () => {
                                    setConfirmModalConfig(EMPTY_MODAL_CONFIG);
                                    onDelete();
                                },
                            })
                        }
                        size="small"
                    >
                        <DeleteIcon fontSize="small" />
                    </Button>
                </div>
            </div>
            <div className="banner-card__content">
                <h2>{banner.title}</h2>
                <p>{banner.text}</p>
            </div>
            {banner.activePages.length > 0 && (
                <div className="banner-card__locations">
                    {banner.activePages.map((activePage) => (
                        <Chip label={activePage} />
                    ))}
                </div>
            )}
            <div className="banner-card__actions">
                {isPublished ? (
                    <Button
                        variant="outlined"
                        className="banner-card__actions__unpublish"
                        onClick={() =>
                            setConfirmModalConfig({
                                isOpen: true,
                                text: t('Da li si siguran da želiš da ukloniš baner?'),
                                onConfirm: () => {
                                    setConfirmModalConfig(EMPTY_MODAL_CONFIG);
                                    onUnpublish();
                                },
                            })
                        }
                    >
                        {t('Ukloni')}
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        className="banner-card__actions__publish"
                        onClick={() => setPublishModalOpen(true)}
                    >
                        {t('Objavi')}
                    </Button>
                )}
            </div>
            <PublishBanner
                isOpen={publishModalOpen}
                onConfirm={(locations) => {
                    onPublish(locations);
                    setPublishModalOpen(false);
                }}
                onCancel={() => setPublishModalOpen(false)}
            />
            <ConfirmModal
                hideNote
                {...confirmModalConfig}
                onCancel={() => setConfirmModalConfig(EMPTY_MODAL_CONFIG)}
            />
        </Styled.BannerCardContainer>
    );
};

export default BannerCard;

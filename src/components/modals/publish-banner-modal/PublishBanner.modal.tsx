import { Button, Chip } from '@mui/material';
import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import theme from '../../../styles/theme';
import { BannerLocation, BannerLocationEnum } from '../../../types/Banner';
import * as Styled from './PublishBanner.styles';

export type PublishBannerModalProps = {
    isOpen: boolean;
    onConfirm: (activeLocations: BannerLocation[]) => void;
    onCancel: () => void;
};

const PublishBanner = ({
    isOpen,
    onConfirm,
    onCancel,
}: PublishBannerModalProps) => {
    const { t } = useTranslation();

    const [selectedLocations, setSelectedLocations] = useState<
        Record<BannerLocationEnum, boolean>
    >({
        ORDER: false,
        ID_TRACKING: false,
        HOME: false,
    });

    const activeLocations: BannerLocation[] = useMemo(() => {
        return Object.entries(selectedLocations)
            .filter(([, value]) => value)
            .map(([key]) => key as BannerLocation);
    }, [selectedLocations]);

    const bannerLocationConfig: {
        label: string;
        key: BannerLocation;
        variant: 'filled' | 'outlined';
    }[] = useMemo(
        () => [
            {
                label: t('Order'),
                key: BannerLocationEnum.ORDER,
                variant: selectedLocations[BannerLocationEnum.ORDER]
                    ? 'filled'
                    : 'outlined',
            },
            {
                label: t('Id tracking'),
                key: BannerLocationEnum.ID_TRACKING,
                variant: selectedLocations[BannerLocationEnum.ID_TRACKING]
                    ? 'filled'
                    : 'outlined',
            },
            {
                label: t('Home'),
                key: BannerLocationEnum.HOME,
                variant: selectedLocations[BannerLocationEnum.HOME]
                    ? 'filled'
                    : 'outlined',
            },
        ],
        [selectedLocations, t]
    );

    const togglePriorityVariant = useCallback((key: BannerLocation) => {
        setSelectedLocations((old) => ({
            ...old,
            [key]: !old[key],
        }));
    }, []);

    return (
        <Styled.PublishBannerContainer
            className="publish-banner-modal"
            title={'Publish banner'}
            isOpen={isOpen}
            onClose={onCancel}
        >
            <div className="publish-banner-modal__chips">
                {bannerLocationConfig.map(({ key, label, variant }) => (
                    <Chip
                        key={key}
                        label={label}
                        variant="outlined"
                        onClick={() => togglePriorityVariant(key)}
                        className={classNames(
                            `publish-banner-modal__chips__chip`,
                            {
                                'publish-banner-modal__chips__chip--selected':
                                    variant === 'filled',
                            }
                        )}
                        style={{
                            backgroundColor:
                                variant === 'filled'
                                    ? theme.PRIMARY_2
                                    : theme.SECONDARY_2,
                        }}
                    />
                ))}
            </div>
            <div className="publish-banner-modal__actions">
                <Button
                    className="publish-banner-modal__actions__publish-button"
                    disabled={Object.values(selectedLocations).every(
                        (v) => v === false
                    )}
                    onClick={() => onConfirm(activeLocations)}
                >
                    Publish
                </Button>
            </div>
        </Styled.PublishBannerContainer>
    );
};

export default PublishBanner;

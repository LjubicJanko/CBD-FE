import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Banner, CreateBannerData } from '../../../types/Banner';
import * as Styled from './Banner.styles';

export type BannerModalProps = {
    isOpen: boolean;
    banner: Banner | undefined;
    onCreate: (createBannerData: CreateBannerData) => void;
    onEdit: (createBannerData: CreateBannerData) => void;
    onCancel: () => void;
};

const BannerModal = ({
    isOpen,
    banner,
    onCreate,
    onEdit,
    onCancel,
}: BannerModalProps) => {
    const { t } = useTranslation();

    const initialValues: CreateBannerData = {
        title: banner?.title || '',
        text: banner?.text || '',
    };

    const validationSchema = Yup.object({
        title: Yup.string(),
    });

    const onSubmit = useCallback(
        (createBannerData: CreateBannerData) => {
            if (banner) {
                onEdit(createBannerData);
            } else {
                onCreate(createBannerData);
            }
        },
        [banner, onCreate, onEdit]
    );

    const formik = useFormik<CreateBannerData>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    return (
        <Styled.BannerContainer
            className="banner-modal"
            title={t(banner ? 'Izmeni baner' : 'Kreiraj baner')}
            isOpen={isOpen}
            onClose={onCancel}
        >
            <form onSubmit={formik.handleSubmit} className="banner-modal__form">
                <div className="banner-modal__form__fields">
                    <TextField
                        className="banner-modal__form__fields__title"
                        label={t('Naslov')}
                        name="title"
                        type="text"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        helperText={formik.errors.title}
                    />
                    <TextField
                        className="banner-modal__form__fields__text"
                        label={t('Tekst')}
                        name="text"
                        type="text"
                        multiline
                        rows={4}
                        value={formik.values.text}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        helperText={formik.errors.text}
                    />
                </div>

                <div className="banner-modal__form__actions">
                    <Button
                        className="banner-modal__form__actions__cancel"
                        onClick={onCancel}
                    >
                        {t('back')}
                    </Button>
                    <Button
                        className="banner-modal__form__actions__confirm"
                        type="submit"
                        variant="contained"
                        disabled={!formik.isValid}
                    >
                        {t('confirm')}
                    </Button>
                </div>
            </form>
        </Styled.BannerContainer>
    );
};

export default BannerModal;

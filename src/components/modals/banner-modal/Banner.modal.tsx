import { Button, TextField } from '@mui/material';
import * as Styled from './Banner.styles';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useCallback } from 'react';
import { CreateBannerData } from '../../../types/Banner';

export type BannerModalProps = {
    isOpen: boolean;
    onConfirm: (createBannerData: CreateBannerData) => void;
    onCancel: () => void;
};

const BannerModal = ({ isOpen, onConfirm, onCancel }: BannerModalProps) => {
    const { t } = useTranslation();

    const initialValues: CreateBannerData = {
        title: '',
        text: '',
    };

    const validationSchema = Yup.object({
        title: Yup.string(),
    });

    const onSubmit = useCallback((createBannerData: CreateBannerData) => {
        onConfirm(createBannerData);
    }, [onConfirm]);

    const formik = useFormik<CreateBannerData>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    return (
        <Styled.BannerContainer
            className="banner-modal"
            title={'Create banner'}
            isOpen={isOpen}
            onClose={onCancel}
        >
            <form onSubmit={formik.handleSubmit} className="banner-modal__form">
                <div className="banner-modal__form__fields">
                    <TextField
                        className="banner-modal__form__fields__title"
                        label="Title"
                        name="title"
                        type="text"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        helperText={formik.errors.title}
                    />
                    <TextField
                        className="banner-modal__form__fields__text"
                        label="Text"
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
                    >
                        {t('confirm')}
                    </Button>
                </div>
            </form>
        </Styled.BannerContainer>
    );
};

export default BannerModal;

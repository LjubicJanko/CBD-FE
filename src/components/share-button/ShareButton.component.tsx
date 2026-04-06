import { IconButton } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../hooks/useSnackbar';

const ShareButton = () => {
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();

    const handleShare = useCallback(() => {
        navigator.clipboard.writeText(window.location.href);
        showSnackbar(t('Url coppied to clipboard'), 'success');
    }, [showSnackbar, t]);

    return (
        <IconButton onClick={handleShare} edge="end" size="small">
            <ShareIcon sx={{ color: '#D4FF00', fontSize: 20 }} />
        </IconButton>
    );
};

export default ShareButton;

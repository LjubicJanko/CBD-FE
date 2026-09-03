import { IconButton, Tooltip } from '@mui/material';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import { useTranslation } from 'react-i18next';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import theme from '../../styles/theme';

// iOS Safari never fires beforeinstallprompt; it gets its own banner in Header.component.tsx instead.
const InstallButton = () => {
    const { t } = useTranslation();
    const { canInstall, promptInstall } = useInstallPrompt();

    if (!canInstall) return null;

    return (
        <Tooltip title={t('pwa.install')}>
            <IconButton onClick={promptInstall} edge="end" size="small">
                <InstallMobileIcon sx={{ color: theme.PRIMARY_2, fontSize: 20 }} />
            </IconButton>
        </Tooltip>
    );
};

export default InstallButton;

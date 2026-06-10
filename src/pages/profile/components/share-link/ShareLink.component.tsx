import {
    Button,
    CircularProgress,
    IconButton,
    TextField,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import { QRCodeCanvas } from 'qrcode.react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthContext from '../../../../store/AuthProvider/Auth.context';
import { platformService, publicTenantService } from '../../../../api';
import localStorageService from '../../../../services/localStorage.service';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import theme from '../../../../styles/theme';
import * as Styled from './ShareLink.styles';

const ShareLink = () => {
    const { t } = useTranslation();
    const { authData } = useContext(AuthContext);
    const { showSnackbar } = useSnackbar();

    const [tenantSlug, setTenantSlug] = useState<string | null>(null);
    const [tenantName, setTenantName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const qrCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (authData?.superadmin) {
            const id = localStorageService.selectedTenantId;
            if (id === null) return;
            setIsLoading(true);
            platformService
                .getTenant(id)
                .then((tenant) => {
                    setTenantSlug(tenant.slug);
                    setTenantName(tenant.name);
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));
        } else if (authData?.tenantSlug) {
            setTenantSlug(authData.tenantSlug);
            publicTenantService
                .getTenantBySlug(authData.tenantSlug)
                .then((tenant) => setTenantName(tenant.name))
                .catch(console.error);
        }
    }, [authData?.superadmin, authData?.tenantSlug]);

    const url = useMemo(
        () =>
            tenantSlug
                ? `${window.location.origin}/order-extension/${tenantSlug}`
                : '',
        [tenantSlug]
    );

    const handleCopy = async () => {
        if (!url) return;
        try {
            await navigator.clipboard.writeText(url);
            showSnackbar(t('share.copied'), 'success');
        } catch (e) {
            console.error(e);
            showSnackbar(t('share.copyFailed'), 'error');
        }
    };

    const handleDownloadQR = () => {
        const canvas = qrCanvasRef.current;
        if (!canvas || !tenantSlug) return;
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${tenantSlug}-order-extension-qr.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
            <div className="loader-wrapper">
                <CircularProgress />
            </div>
        );
    }

    if (!tenantSlug) {
        return (
            <Styled.ShareLinkContainer>
                <p className="share-link__description">
                    {t('share.noTenant')}
                </p>
            </Styled.ShareLinkContainer>
        );
    }

    return (
        <Styled.ShareLinkContainer className="share-link">
            <h3>{t('share.title')}</h3>
            <p className="share-link__description">
                {t('share.description', {
                    tenant: tenantName ?? tenantSlug,
                })}
            </p>

            <div className="share-link__url-row">
                <TextField
                    fullWidth
                    value={url}
                    InputProps={{ readOnly: true }}
                />
                <IconButton
                    onClick={handleCopy}
                    title={t('share.copyUrl')}
                    aria-label={t('share.copyUrl')}
                >
                    <ContentCopyIcon />
                </IconButton>
            </div>

            <div className="share-link__qr">
                <QRCodeCanvas
                    ref={qrCanvasRef}
                    value={url}
                    size={220}
                    bgColor={theme.SECONDARY_1}
                    fgColor={theme.PRIMARY_1}
                    level="M"
                    marginSize={2}
                />
            </div>

            <Button
                className="share-link__download"
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadQR}
            >
                {t('share.downloadQR')}
            </Button>
        </Styled.ShareLinkContainer>
    );
};

export default ShareLink;

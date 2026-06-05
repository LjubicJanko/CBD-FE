import { Button, CircularProgress } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tenant } from '../../api/services/platform';
import CbdModal from '../../components/cbd-modal/CbdModal.component';

type DeactivateTenantDialogProps = {
    /** The tenant pending deactivation, or null when the dialog is closed. */
    tenant: Tenant | null;
    isDeactivating: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

const DeactivateTenantDialog: React.FC<DeactivateTenantDialogProps> = ({
    tenant,
    isDeactivating,
    onCancel,
    onConfirm,
}) => {
    const { t } = useTranslation();

    return (
        <CbdModal
            isOpen={tenant !== null}
            onClose={() => !isDeactivating && onCancel()}
            title={t('platform.deactivateTitle')}
        >
            <div className="platform__deactivate-dialog">
                <p>
                    {t('platform.deactivateConfirm', {
                        name: tenant?.name ?? '',
                    })}
                </p>
                <div className="platform__deactivate-dialog__actions">
                    <Button
                        variant="outlined"
                        onClick={onCancel}
                        disabled={isDeactivating}
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onConfirm}
                        disabled={isDeactivating}
                    >
                        {isDeactivating ? (
                            <CircularProgress size={20} />
                        ) : (
                            t('platform.deactivate')
                        )}
                    </Button>
                </div>
            </div>
        </CbdModal>
    );
};

export default DeactivateTenantDialog;

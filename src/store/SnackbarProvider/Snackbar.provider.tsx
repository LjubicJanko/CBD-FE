import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import SnackbarContext, { SnackbarType } from './Snackbar.context';
import { Snackbar, Alert } from '@mui/material';
import authBus, { SnackbarPayload } from '../../services/bus';

const SnackbarProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [snackbarProps, setSnackbarProps] = useState({
    open: false,
    message: '',
    type: 'success' as SnackbarType,
  });

  const showSnackbar = useCallback((message: string, type: SnackbarType) => {
    setSnackbarProps({ open: true, message, type });
  }, []);

  useEffect(() => {
    // Lets non-React code (e.g. the axios response interceptor) push toasts
    // by emitting on authBus. See privateClient.tsx for the 403/410 path.
    const onSnackbar = (payload: SnackbarPayload) => {
      if (!payload?.message) return;
      showSnackbar(payload.message, (payload.severity ?? 'error') as SnackbarType);
    };
    authBus.on<SnackbarPayload>('snackbar', onSnackbar);
    return () => authBus.off<SnackbarPayload>('snackbar', onSnackbar);
  }, [showSnackbar]);

  const handleClose = () => {
    setSnackbarProps((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbarProps.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarProps.type}
          variant="filled"
        >
          {snackbarProps.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;

import React, { PropsWithChildren, useCallback, useState } from 'react';
import SnackbarContext, { SnackbarType } from './Snackbar.context';
import { Snackbar, Alert } from '@mui/material';

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

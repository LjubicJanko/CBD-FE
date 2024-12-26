import { useContext } from 'react';
import SnackbarContext, {
  SnackbarContextInterface,
} from '../store/SnackbarProvider/Snackbar.context';

export const useSnackbar = (): SnackbarContextInterface => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

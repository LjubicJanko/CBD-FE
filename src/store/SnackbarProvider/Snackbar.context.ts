import { createContext } from 'react';

export type SnackbarType = 'success' | 'info' | 'warning' | 'error';

export interface SnackbarContextInterface {
  showSnackbar: (message: string, type: SnackbarType) => void;
}

export default createContext<SnackbarContextInterface>({
  showSnackbar: () => {},
});

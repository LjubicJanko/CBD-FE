import AuthProvider from './store/AuthProvider';
import CBDRouter from './store/CBDRouter/CBDRouter';
import { GlobalStyle } from './globalStyles';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import SnackbarProvider from './store/SnackbarProvider';

const App = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SnackbarProvider>
        <AuthProvider>
          <CBDRouter />
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;

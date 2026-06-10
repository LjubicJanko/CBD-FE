import AuthProvider from './store/AuthProvider';
import TenantThemeSync from './store/AuthProvider/TenantThemeSync';
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
                    <TenantThemeSync />
                    <CBDRouter />
                </AuthProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export default App;

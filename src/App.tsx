import AuthProvider from './store/AuthProvider';
import CBDRouter from './store/CBDRouter/CBDRouter';
import { GlobalStyle } from './globalStyles';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import SnackbarProvider from './store/SnackbarProvider';
import BannerProvider from './store/BannerProvider';

const App = (): JSX.Element => {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <SnackbarProvider>
                <AuthProvider>
                    <BannerProvider>
                        <CBDRouter />
                    </BannerProvider>
                </AuthProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export default App;

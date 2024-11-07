import AuthProvider from './store/AuthProvider';
import CBDRouter from './store/CBDRouter/CBDRouter';
import { GlobalStyle } from './globalStyles';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';

const App = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <CBDRouter />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

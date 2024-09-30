import { Fragment } from 'react/jsx-runtime';
import AuthProvider from './store/AuthProvider';
import CBDRouter from './store/CBDRouter/CBDRouter';
import { GlobalStyle } from './globalStyles';

const App = (): JSX.Element => {
  return (
    <Fragment>
      <GlobalStyle />
      <AuthProvider>
        <CBDRouter />
      </AuthProvider>
    </Fragment>
  );
};

export default App;

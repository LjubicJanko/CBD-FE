import { Button } from '@mui/material';
import { useContext, useMemo } from 'react';
import AuthContext from '../../store/AuthProvider/Auth.context';
import * as Styled from './Header.styles';
import { useLocation, useNavigate } from 'react-router-dom';

const HeaderComponent = () => {
  const { logout, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  console.log(location.pathname);
  const shouldHideLink = useMemo(
    () => location.pathname === '/login',
    [location.pathname]
  );

  return (
    <Styled.HeaderContainer>
      <p>CBD</p>
      {shouldHideLink ? (
        <Button variant="contained" onClick={() => navigate('/')}>
          Go to home
        </Button>
      ) : token ? (
        <Button variant="contained" onClick={() => logout(navigate)}>
          Logout
        </Button>
      ) : (
        <Button variant="contained" onClick={() => navigate('/login')}>
          Go to login
        </Button>
      )}
    </Styled.HeaderContainer>
  );
};

export default HeaderComponent;

import { PropsWithChildren, useContext } from 'react';
import AuthContext from '../AuthProvider/Auth.context';
import { Redirect } from 'react-router';

const PublicRouteWrapper = ({ children }: PropsWithChildren) => {
  const { token } = useContext(AuthContext);

  return token ? (
    <Redirect to={'/companies-overview'} />
  ) : (
    <div className="children">{children}</div>
  );
};

export default PublicRouteWrapper;

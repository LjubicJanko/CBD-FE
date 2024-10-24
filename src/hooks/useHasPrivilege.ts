import { useContext, useMemo } from 'react';
import AuthContext from '../store/AuthProvider/Auth.context';

export type PrivilegeProps = {
  requiredPrivilege: string;
};

export const useHasPrivilege = (requiredPrivilege: string) => {
  const { authData } = useContext(AuthContext);

  const hasPrivilege = useMemo(
    () => !!authData?.privileges.includes(requiredPrivilege),
    [authData?.privileges, requiredPrivilege]
  );

  return hasPrivilege;
};

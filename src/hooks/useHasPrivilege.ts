import { useContext, useMemo } from 'react';
import AuthContext from '../store/AuthProvider/Auth.context';

export type PrivilegeProps = {
  requiredPrivilege: string;
};

export const useHasPrivilege = (requiredPrivilege: string) => {
  const { authData } = useContext(AuthContext);

  const hasPrivilege = useMemo(
    () => {

      if(authData?.isSuperAdmin) return true;

      return !!authData?.privileges.includes(requiredPrivilege)
    },
    [authData?.isSuperAdmin, authData?.privileges, requiredPrivilege]
  );

  return hasPrivilege;
};

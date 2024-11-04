import { useContext, useMemo } from 'react';
import AuthContext from '../store/AuthProvider/Auth.context';
import { privileges } from '../util/util';

export const usePrivileges = () => {
  const { authData } = useContext(AuthContext);

  return useMemo(() => {
    const authPrivileges = authData?.privileges || [];

    return {
      canEditData: authPrivileges.includes(privileges.ORDER_INFO_EDIT),
      canCancelOrder: authPrivileges.includes(privileges.ORDER_CANCEL),
      canPauseOrder: authPrivileges.includes(privileges.ORDER_PAUSE),
      canMoveToPrintReady: authPrivileges.includes(
        privileges.MOVE_TO_PRINT_READY
      ),
      canMoveToPrinting: authPrivileges.includes(privileges.MOVE_TO_PRINTING),
      canMoveToSewing: authPrivileges.includes(privileges.MOVE_TO_SEWING),
      canMoveToShipReady: authPrivileges.includes(
        privileges.MOVE_TO_SHIP_READY
      ),
      canMoveToShipped: authPrivileges.includes(privileges.MOVE_TO_SHIPPED),
      canMoveToDone: authPrivileges.includes(privileges.MOVE_TO_DONE),
      canAddPayment: authPrivileges.includes(privileges.PAYMENT_ADD),
    };
  }, [authData?.privileges]);
};

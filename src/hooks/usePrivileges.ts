import { useContext, useMemo } from 'react';
import AuthContext from '../store/AuthProvider/Auth.context';
import { privileges } from '../util/util';

export const usePrivileges = () => {
  const { authData } = useContext(AuthContext);

  return useMemo(() => {
    const authPrivileges = authData?.privileges || [];
    const isSuperadmin = Boolean(authData?.superadmin);

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
      // A superadmin oversees every tenant but is never an employee of one, so
      // he never records his own attendance: suppress check-in (hides the
      // "My attendance" tab, the header clock badge, and the session fetch),
      // while always granting the oversight views (attendance table +
      // locations) regardless of the impersonated tenant's privilege set.
      canCheckIn:
        !isSuperadmin && authPrivileges.includes(privileges.ATTENDANCE_CHECK_IN),
      canViewAttendance:
        isSuperadmin || authPrivileges.includes(privileges.ATTENDANCE_VIEW_ALL),
      canEditAttendance:
        isSuperadmin || authPrivileges.includes(privileges.ATTENDANCE_EDIT),
      canManageLocations:
        isSuperadmin || authPrivileges.includes(privileges.LOCATION_MANAGE),
    };
  }, [authData?.privileges, authData?.superadmin]);
};

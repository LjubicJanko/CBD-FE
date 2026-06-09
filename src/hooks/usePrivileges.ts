import { useContext, useMemo } from 'react';
import AuthContext from '../store/AuthProvider/Auth.context';
import { privileges } from '../util/util';
import { useFeatures } from './useFeatures';
import { Feature } from '../util/features';

export const usePrivileges = () => {
  const { authData } = useContext(AuthContext);
  // Tenant-level capability layer. ANDing features into the per-user privilege
  // booleans makes every existing consumer (payment button, attendance badge,
  // tabs, ...) respect premium gating automatically. See useFeatures for the
  // superadmin (localStorage) vs regular-user (context) resolution invariant.
  const features = useFeatures();

  return useMemo(() => {
    const authPrivileges = authData?.privileges || [];
    const isSuperadmin = Boolean(authData?.superadmin);
    const hasOrders = features.includes(Feature.ORDERS);
    const hasAttendance = features.includes(Feature.ATTENDANCE);

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
      // Payments are part of the `orders` module.
      canAddPayment:
        hasOrders && authPrivileges.includes(privileges.PAYMENT_ADD),
      // A superadmin oversees every tenant but is never an employee of one, so
      // he never records his own attendance: suppress check-in (hides the
      // "My attendance" tab, the header clock badge, and the session fetch),
      // while always granting the oversight views (attendance table +
      // locations) regardless of the impersonated tenant's privilege set.
      // All attendance capabilities additionally require the tenant to have the
      // `attendance` feature enabled.
      canCheckIn:
        hasAttendance &&
        !isSuperadmin &&
        authPrivileges.includes(privileges.ATTENDANCE_CHECK_IN),
      canViewAttendance:
        hasAttendance &&
        (isSuperadmin ||
          authPrivileges.includes(privileges.ATTENDANCE_VIEW_ALL)),
      canEditAttendance:
        hasAttendance &&
        (isSuperadmin || authPrivileges.includes(privileges.ATTENDANCE_EDIT)),
      canManageLocations:
        hasAttendance &&
        (isSuperadmin || authPrivileges.includes(privileges.LOCATION_MANAGE)),
    };
  }, [authData?.privileges, authData?.superadmin, features]);
};

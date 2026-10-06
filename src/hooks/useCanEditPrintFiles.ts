import {
  Order,
  OrderExecutionStatusEnum,
  OrderStatusEnum,
} from '../types/Order';
import { statuses } from '../util/util';
import { useIsCompanyAdmin } from './useRole';

// PENDING is not in `statuses`, so it resolves to -1 and is excluded.
const PRINT_READY_INDEX = statuses.indexOf(OrderStatusEnum.PRINT_READY);

// Admin-only, active orders at PRINT_READY or later.
export const useCanEditPrintFiles = (
  order?: Pick<Order, 'status' | 'executionStatus'> | null
): boolean => {
  const isAdmin = useIsCompanyAdmin();
  return (
    isAdmin &&
    !!order &&
    order.executionStatus === OrderExecutionStatusEnum.ACTIVE &&
    statuses.indexOf(order.status) >= PRINT_READY_INDEX
  );
};

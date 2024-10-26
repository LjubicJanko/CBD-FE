import { OrderStatus } from '../types/Order';

export const statuses: OrderStatus[] = [
  'DESIGN',
  'PRINT_READY',
  'PRINTING',
  'SEWING',
  'SHIP_READY',
  'SHIPPED',
  'DONE',
];

interface StatusChipProps {
  status:
    | 'DESIGN'
    | 'PRINT_READY'
    | 'PRINTING'
    | 'SEWING'
    | 'SHIP_READY'
    | 'SHIPPED'
    | 'DONE';
}

/**
 * 
 * 
дизајн
припрема за штампу
штампање
шивење
спремно за слање
послато
затворено

 * 
 */

export const statusColors: Record<StatusChipProps['status'], string> = {
  DESIGN: '#4FC3F7',
  PRINT_READY: '#81C784',
  PRINTING: '#FFB74D',
  SEWING: '#26A69A',
  SHIP_READY: '#FF8A65',
  SHIPPED: '#AB47BC',
  DONE: '#388E3C',
};

export const getNextStatus = (orderStatus: OrderStatus) => {
  const index = statuses.findIndex((x) => x === orderStatus);

  return [-1, statuses.length - 1].includes(index) ? '' : statuses[index + 1];
};

export enum privileges {
  ORDER_CREATE = 'order-create',
  ORDER_INFO_EDIT = 'order-info-edit',
  ORDER_CANCEL = 'order-cancel',
  ORDER_PAUSE = 'order-pause',
  MOVE_TO_PRINT_READY = 'move-to-print-ready',
  MOVE_TO_PRINTING = 'move-to-printing',
  MOVE_TO_SEWING = 'move-to-sewing',
  MOVE_TO_SHIP_READY = 'move-to-ship-ready',
  MOVE_TO_SHIPPED = 'move-to-shipped',
  MOVE_TO_DONE = 'move-to-done',
}

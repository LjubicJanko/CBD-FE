import { OrderStatus, PostServices } from '../types/Order';

export const statuses: OrderStatus[] = [
  'DESIGN',
  'PRINT_READY',
  'PRINTING',
  'SEWING',
  'SHIP_READY',
  'SHIPPED',
  'DONE',
];

export const extensionStatuses: OrderStatus[] = [
  'PENDING',
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
    | 'PENDING'
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
  PENDING: '#4FC3F7',
  PRINT_READY: '#81C784',
  PRINTING: '#FFB74D',
  SEWING: '#26A69A',
  SHIP_READY: '#FF8A65',
  SHIPPED: '#AB47BC',
  DONE: '#388E3C',
};

const nextStatusDictionary = {
  DESIGN: 'PRINT_READY',
  PENDING: 'PRINT_READY',
  PRINT_READY: 'PRINTING',
  PRINTING: 'SEWING',
  SEWING: 'SHIP_READY',
  SHIP_READY: 'SHIPPED',
  SHIPPED: 'DONE',
  DONE: 'DONE',
};

export const getNextStatus = (orderStatus: OrderStatus) => {
  // const index = statuses.findIndex((x) => x === orderStatus);

  // return [-1, statuses.length - 1].includes(index) ? '' : statuses[index + 1];

  return nextStatusDictionary[orderStatus];
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
  PAYMENT_ADD = 'payment-add',
}

export const textInputSX = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white', // Default border color
    },
    '&:hover fieldset': {
      borderColor: 'white', // Border color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white', // Border color when focused
    },
  },
  '& .MuiInputLabel-root': {
    color: 'white', // Optional: Make the label white
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'white', // Label color when focused
  },
};

export const trackingUrl: Record<PostServices, string> = {
  aks: 'https://www.aks.rs/pracenje-posiljke/',
  d: 'https://www.dexpress.rs/rs/pracenje-posiljaka',
  city: 'https://www.cityexpress.rs/pracenje-posiljke',
  post: 'https://www.posta.rs/cir/alati/pracenje-posiljke.aspx',
  bex: 'https://bexexpress.rs/pracenje-posiljke',
};

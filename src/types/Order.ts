export type OrderStatus =
  | 'DESIGN'
  | 'PRINT_READY'
  | 'PRINTING'
  | 'PRINTED'
  | 'SHIPPED'
  | 'DONE';

export const orderStatusArray = [
  'DESIGN',
  'PRINT_READY',
  'PRINTING',
  'PRINTED',
  'SHIPPED',
  'DONE',
];

export type OrderStatusHistory = {
  id: number;
  status: OrderStatus;
  timestamp: string;
  user: string;
};

export type Order = {
  id: number;
  trackingId: string;
  name: string;
  description: string;
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
};

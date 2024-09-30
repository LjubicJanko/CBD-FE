import { OrderStatus } from '../types/Order';

export const statuses: OrderStatus[] = [
  'DESIGN',
  'PRINT_READY',
  'PRINTING',
  'PRINTED',
  'SHIPPED',
  'DONE',
];

export const getNextStatus = (orderStatus: OrderStatus) => {
  const index = statuses.findIndex((x) => x === orderStatus);

  return [-1, statuses.length - 1].includes(index) ? '' : statuses[index + 1];
};

import { OrderStatus } from '../types/Order';

export const statuses: OrderStatus[] = [
  'DESIGN',
  'PRINT_READY',
  'PRINTING',
  'PRINTED',
  'SHIPPED',
  'DONE',
];

interface StatusChipProps {
  status:
    | 'DESIGN'
    | 'PRINT_READY'
    | 'PRINTING'
    | 'PRINTED'
    | 'SHIPPED'
    | 'DONE';
}

export const statusColors: Record<StatusChipProps['status'], string> = {
  DESIGN: '#42A5F5',
  PRINT_READY: '#66BB6A',
  PRINTING: '#FFA726',
  PRINTED: '#26A69A',
  SHIPPED: '#AB47BC',
  DONE: '#43A047',
};

export const getNextStatus = (orderStatus: OrderStatus) => {
  const index = statuses.findIndex((x) => x === orderStatus);

  return [-1, statuses.length - 1].includes(index) ? '' : statuses[index + 1];
};

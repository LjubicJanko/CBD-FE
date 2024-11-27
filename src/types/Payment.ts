import { Dayjs } from 'dayjs';

export type Payment = {
  id: number;
  payer: string;
  amount: number;
  paymentDate: Dayjs;
  paymentMethod: 'ACCOUNT' | 'CASH' | 'INVOICE';
  note?: string;
};

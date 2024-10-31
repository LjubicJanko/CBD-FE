import { Dayjs } from 'dayjs';

export type Payment = {
  id: number;
  payer: string;
  amount: number;
  dateOfTransaction: Dayjs;
  paymentMethod: 'ACCOUNT' | 'CASH' | 'INVOICE';
  note?: string;
};

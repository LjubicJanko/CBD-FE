export type Payment = {
  id: number;
  payer: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'ACCOUNT' | 'CASH' | 'INVOICE';
  note?: string;
};

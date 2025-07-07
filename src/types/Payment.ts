export type Payment = {
  id: number;
  payer: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'ACCOUNT' | 'CASH' | 'INVOICE' | 'ON_SHIP';
  note?: string;
};

export type UpdatePaymentsResponse = {
  amountPaid: number;
  amountLeftToPay: number;
  payments: Payment[];
};

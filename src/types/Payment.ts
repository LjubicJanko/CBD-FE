export type PaymentMethod = 'ACCOUNT' | 'CASH' | 'INVOICE' | 'ON_SHIP';

export type Payment = {
  id: number;
  payer: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod | null;
  note?: string;
};

export type NewPayment = Omit<Payment, 'id' | 'paymentMethod'> & {
  paymentMethod: PaymentMethod;
};

export type UpdatePaymentsResponse = {
  amountPaid: number;
  amountLeftToPay: number;
  payments: Payment[];
};

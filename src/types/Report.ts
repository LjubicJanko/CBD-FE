import { PaginatedResponse } from './Response';

export type OrderReport = {
    orderCount: number;
    regularOrderCount: number;
    extensionOrderCount: number;
    totalAcquisitionCost: number;
    averageAcquisitionCost: number;
    totalAmountPaid: number | null;
    totalSalePrice: number | null;
    totalOutstanding: number | null;
    profitMargin: number | null;
};

export type StatusDurationEntry = {
    status: string;
    averageHours: number;
    percentage: number;
};

export type StatusDurationReport = {
    totalOrdersAnalyzed: number;
    statusDurations: StatusDurationEntry[];
};

export type PaymentsReportMethodFilter =
    'ACCOUNT' | 'CASH' | 'ON_SHIP' | 'INVOICE' | 'UNSPECIFIED';

export type PaymentReportRow = {
    id: number;
    orderId: number;
    orderName: string;
    trackingId: string;
    payer: string;
    amount: number;
    paymentDate: string;
    paymentMethod: Exclude<PaymentsReportMethodFilter, 'UNSPECIFIED'> | null;
    note?: string | null;
};

export type PaymentsReport = PaginatedResponse<PaymentReportRow[]> & {
    currency: string;
    totals: {
        overall: number;
        count: number;
        bankTotal: number;
        byMethod: Record<PaymentsReportMethodFilter, number>;
    };
};

export type UnpaidOrderRow = {
    orderId: number;
    orderName: string;
    trackingId: string;
    status: string;
    executionStatus: string;
    salePrice: number;
    amountPaid: number;
    amountLeftToPay: number;
    lastPaymentDate: string | null;
    paymentCount: number;
};

export type UnpaidOrdersReport = PaginatedResponse<UnpaidOrderRow[]> & {
    currency: string;
    totals: {
        outstanding: number;
        count: number;
    };
};

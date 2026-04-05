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

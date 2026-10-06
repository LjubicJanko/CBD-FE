export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency: 'RSD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

// Outstanding / left-to-pay values must never render as negative, even if a
// response still contains one (overpaid orders).
export const formatNonNegativeCurrency = (value: number): string =>
    formatCurrency(Math.max(value, 0));

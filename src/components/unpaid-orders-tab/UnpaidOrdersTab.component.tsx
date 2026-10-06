import {
    Button,
    CircularProgress,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import reportsService from '../../api/services/reports';
import { SortType } from '../modals/filters/FiltersModal.component';
import { usePageForKey } from '../../hooks/usePageForKey';
import { useReportRequest } from '../../hooks/useReportRequest';
import { formatNonNegativeCurrency } from '../../util/currency';
import { StatCard, StatsGrid } from '../../pages/reports/Reports.styles';
import ReportFilterChip from '../report-table/ReportFilterChip.component';
import ReportSortSelect from '../report-table/ReportSortSelect.component';
import { DEFAULT_PER_PAGE } from '../report-table/reportPagination.constants';
import * as TableStyled from '../report-table/ReportTable.styles';

export type UnpaidOrdersTabProps = {
    from: string;
    to: string;
    isRangeValid: boolean;
};

const UnpaidOrdersTab = ({ from, to, isRangeValid }: UnpaidOrdersTabProps) => {
    const { t } = useTranslation();

    const [withoutPaymentsInRange, setWithoutPaymentsInRange] = useState(false);
    const [sort, setSort] = useState<SortType>('desc');

    const [page, setPage] = usePageForKey(
        JSON.stringify([from, to, withoutPaymentsInRange, sort])
    );

    const fetcher = useCallback(
        () =>
            reportsService.getUnpaidOrdersReport({
                from,
                to,
                withoutPaymentsInRange,
                sort,
                page,
                perPage: DEFAULT_PER_PAGE,
            }),
        [from, to, withoutPaymentsInRange, sort, page]
    );
    const { data, isLoading, hasError, retry } = useReportRequest(
        fetcher,
        isRangeValid
    );

    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0 });
    }, [data]);

    if (!isRangeValid) return null;

    return (
        <TableStyled.ReportTableContainer>
            <div className="report-table__toolbar">
                <ReportFilterChip
                    label={t('only-no-payments-in-period')}
                    isActive={withoutPaymentsInRange}
                    onClick={() => setWithoutPaymentsInRange((old) => !old)}
                />
                <ReportSortSelect
                    value={sort}
                    onChange={setSort}
                    options={[
                        { value: 'desc', label: t('sort-largest-first') },
                        { value: 'asc', label: t('sort-smallest-first') },
                    ]}
                />
            </div>

            {hasError ? (
                <div
                    className="report-table__state report-table__state--error"
                    role="alert"
                >
                    <span>{t('unpaid-orders-load-failed')}</span>
                    <Button
                        className="report-table__retry"
                        variant="outlined"
                        onClick={retry}
                    >
                        {t('retry')}
                    </Button>
                </div>
            ) : data ? (
                <>
                    <StatsGrid className="report-table__summary">
                        <StatCard $accent>
                            <span className="stat-card__label">
                                {t('outstanding')}
                            </span>
                            <span className="stat-card__value">
                                {formatNonNegativeCurrency(
                                    data.totals.outstanding
                                )}
                            </span>
                        </StatCard>
                        <StatCard>
                            <span className="stat-card__label">
                                {t('unpaid-orders')}
                            </span>
                            <span className="stat-card__value">
                                {data.totals.count}
                            </span>
                        </StatCard>
                    </StatsGrid>

                    <p className="report-table__note">
                        {t('unpaid-date-basis-note')}
                    </p>

                    {data.data.length === 0 ? (
                        <div className="report-table__state">
                            {t('no-unpaid-orders')}
                        </div>
                    ) : (
                        <div
                            className="report-table__scroll"
                            ref={scrollRef}
                            aria-busy={isLoading}
                        >
                            <Table
                                className="report-table__table"
                                aria-label={t('unpaid-orders')}
                            >
                                <TableHead className="report-table__table-header">
                                    <TableRow>
                                        <TableCell className="report-table__header-cell">
                                            {t('order')}
                                        </TableCell>
                                        <TableCell className="report-table__header-cell">
                                            {t('status')}
                                        </TableCell>
                                        <TableCell className="report-table__header-cell report-table__header-cell--amount">
                                            {t('sale-price')}
                                        </TableCell>
                                        <TableCell className="report-table__header-cell report-table__header-cell--amount">
                                            {t('paid')}
                                        </TableCell>
                                        <TableCell className="report-table__header-cell report-table__header-cell--amount">
                                            {t('left-to-pay')}
                                        </TableCell>
                                        <TableCell className="report-table__header-cell">
                                            {t('last-payment')}
                                        </TableCell>
                                        <TableCell className="report-table__header-cell report-table__header-cell--amount">
                                            {t('payments-count-short')}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.data.map((row) => (
                                        <TableRow
                                            key={row.orderId}
                                            className="report-table__row"
                                        >
                                            <TableCell
                                                className="report-table__cell report-table__cell--order"
                                                data-label={t('order')}
                                            >
                                                <Link
                                                    className="report-table__order-link"
                                                    to={`/dashboard?orderId=${row.orderId}`}
                                                >
                                                    {row.orderName}
                                                </Link>
                                                <span className="report-table__order-tracking">
                                                    {row.trackingId}
                                                </span>
                                            </TableCell>
                                            <TableCell
                                                className="report-table__cell"
                                                data-label={t('status')}
                                            >
                                                {t(row.status)}
                                            </TableCell>
                                            <TableCell
                                                className="report-table__cell report-table__cell--amount"
                                                data-label={t('sale-price')}
                                            >
                                                {formatNonNegativeCurrency(
                                                    row.salePrice
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className="report-table__cell report-table__cell--amount"
                                                data-label={t('paid')}
                                            >
                                                {formatNonNegativeCurrency(
                                                    row.amountPaid
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className="report-table__cell report-table__cell--amount"
                                                data-label={t('left-to-pay')}
                                            >
                                                {formatNonNegativeCurrency(
                                                    row.amountLeftToPay
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className="report-table__cell report-table__cell--date"
                                                data-label={t('last-payment')}
                                            >
                                                {row.lastPaymentDate
                                                    ? dayjs(
                                                          row.lastPaymentDate
                                                      ).format('DD.MM.YYYY')
                                                    : '-'}
                                            </TableCell>
                                            <TableCell
                                                className="report-table__cell report-table__cell--amount"
                                                data-label={t(
                                                    'payments-count-short'
                                                )}
                                            >
                                                {row.paymentCount}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    <div className="report-table__footer">
                        <p className="report-table__total">
                            {t('pagination-total', {
                                TOTAL: data.totalElements,
                            })}
                        </p>
                        <div className="report-table__pagination">
                            <Pagination
                                count={Math.max(data.total, 1)}
                                page={page + 1}
                                onChange={(_event, value) => setPage(value - 1)}
                            />
                        </div>
                    </div>
                </>
            ) : (
                isLoading && (
                    <div className="report-table__state">
                        <CircularProgress size={28} />
                    </div>
                )
            )}
        </TableStyled.ReportTableContainer>
    );
};

export default UnpaidOrdersTab;

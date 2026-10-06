import {
    Button,
    CircularProgress,
    IconButton,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import reportsService from '../../api/services/reports';
import { SortType } from '../modals/filters/FiltersModal.component';
import { usePageForKey } from '../../hooks/usePageForKey';
import { useReportRequest } from '../../hooks/useReportRequest';
import { PaymentsReportMethodFilter } from '../../types/Report';
import { formatCurrency } from '../../util/currency';
import { StatCard, StatsGrid } from '../../pages/reports/Reports.styles';
import ReportFilterChip from '../report-table/ReportFilterChip.component';
import ReportSortSelect from '../report-table/ReportSortSelect.component';
import { DEFAULT_PER_PAGE } from '../report-table/reportPagination.constants';
import * as TableStyled from '../report-table/ReportTable.styles';

export type PaymentsTabProps = {
    from: string;
    to: string;
    isRangeValid: boolean;
};

const METHOD_OPTIONS: PaymentsReportMethodFilter[] = [
    'ACCOUNT',
    'CASH',
    'ON_SHIP',
    'INVOICE',
    'UNSPECIFIED',
];

const PaymentsTab = ({ from, to, isRangeValid }: PaymentsTabProps) => {
    const { t } = useTranslation();

    const [methods, setMethods] = useState<PaymentsReportMethodFilter[]>([]);
    const [sort, setSort] = useState<SortType>('desc');

    const [page, setPage] = usePageForKey(
        JSON.stringify([from, to, methods, sort])
    );

    const fetcher = useCallback(
        () =>
            reportsService.getPaymentsReport({
                from,
                to,
                methods,
                sort,
                page,
                perPage: DEFAULT_PER_PAGE,
            }),
        [from, to, methods, sort, page]
    );
    const { data, isLoading, hasError, retry } = useReportRequest(
        fetcher,
        isRangeValid
    );

    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0 });
    }, [data]);

    const methodLabel = useCallback(
        (method: PaymentsReportMethodFilter | null) =>
            method && method !== 'UNSPECIFIED'
                ? t(method)
                : t('method-unspecified'),
        [t]
    );

    const toggleMethod = (method: PaymentsReportMethodFilter) =>
        setMethods((old) =>
            METHOD_OPTIONS.filter((option) =>
                option === method ? !old.includes(option) : old.includes(option)
            )
        );

    const totals = data?.totals;
    const byMethod = totals?.byMethod;

    const methodCards = useMemo(
        () =>
            (['ACCOUNT', 'CASH', 'ON_SHIP', 'INVOICE'] as const).map(
                (method) => ({
                    method,
                    label: t(method),
                    value: byMethod?.[method] ?? 0,
                })
            ),
        [byMethod, t]
    );

    if (!isRangeValid) return null;

    return (
        <TableStyled.ReportTableContainer>
            <div className="report-table__toolbar">
                <div className="report-table__field">
                    <span
                        id="payments-method-filter-label"
                        className="report-table__label"
                    >
                        {t('filter-by-method')}
                    </span>
                    <div
                        className="report-table__chips"
                        role="group"
                        aria-labelledby="payments-method-filter-label"
                    >
                        <ReportFilterChip
                            label={t('all-methods')}
                            isActive={methods.length === 0}
                            onClick={() => setMethods([])}
                        />
                        {METHOD_OPTIONS.map((method) => (
                            <ReportFilterChip
                                key={method}
                                label={methodLabel(method)}
                                isActive={methods.includes(method)}
                                onClick={() => toggleMethod(method)}
                            />
                        ))}
                    </div>
                </div>
                <ReportSortSelect
                    value={sort}
                    onChange={setSort}
                    options={[
                        { value: 'desc', label: t('newest-to-oldest') },
                        { value: 'asc', label: t('oldest-to-newest') },
                    ]}
                />
            </div>

            {hasError ? (
                <div
                    className="report-table__state report-table__state--error"
                    role="alert"
                >
                    <span>{t('payments-report-load-failed')}</span>
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
                                {t('bank-total')}
                                <Tooltip
                                    title={t('bank-total-hint')}
                                    arrow
                                    enterTouchDelay={0}
                                >
                                    <IconButton
                                        className="stat-card__info"
                                        size="small"
                                        aria-label={t('bank-total-hint')}
                                    >
                                        <InfoOutlinedIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            </span>
                            <span className="stat-card__value">
                                {formatCurrency(data.totals.bankTotal)}
                            </span>
                        </StatCard>
                        {methodCards.map((card) => (
                            <StatCard key={card.method}>
                                <span className="stat-card__label">
                                    {card.label}
                                </span>
                                <span className="stat-card__value">
                                    {formatCurrency(card.value)}
                                </span>
                            </StatCard>
                        ))}
                        {(byMethod?.UNSPECIFIED ?? 0) !== 0 && (
                            <StatCard>
                                <span className="stat-card__label">
                                    {t('method-unspecified')}
                                </span>
                                <span className="stat-card__value">
                                    {formatCurrency(byMethod?.UNSPECIFIED ?? 0)}
                                </span>
                            </StatCard>
                        )}
                        <StatCard>
                            <span className="stat-card__label">
                                {t('payments-total')}
                            </span>
                            <span className="stat-card__value">
                                {formatCurrency(data.totals.overall)}
                            </span>
                            <span className="stat-card__breakdown">
                                {t('payments-count')}: {data.totals.count}
                            </span>
                        </StatCard>
                    </StatsGrid>

                    <p className="report-table__note">
                        {t('payments-date-basis-note')}
                    </p>

                    {data.data.length === 0 ? (
                        <div className="report-table__state">
                            {t('no-payments-in-period')}
                        </div>
                    ) : (
                        <div
                            className="report-table__scroll"
                            ref={scrollRef}
                            aria-busy={isLoading}
                        >
                            <Table
                                className="report-table__table"
                                aria-label={t('payments')}
                            >
                                <TableHead className="report-table__table-header">
                                    <TableRow>
                                        <TableCell className="report-table__header-cell">
                                            {t('transaction-date')}
                                        </TableCell>
                                        <TableCell className="report-table__header-cell">
                                            {t('order')}
                                        </TableCell>
                                        <TableCell className="report-table__header-cell">
                                            {t('payer')}
                                        </TableCell>
                                        <TableCell className="report-table__header-cell">
                                            {t('payment-method')}
                                        </TableCell>
                                        <TableCell className="report-table__header-cell report-table__header-cell--amount">
                                            {t('amount')}
                                        </TableCell>
                                        <TableCell className="report-table__header-cell">
                                            {t('note')}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.data.map((payment) => (
                                        <TableRow
                                            key={payment.id}
                                            className="report-table__row"
                                        >
                                            <TableCell
                                                className="report-table__cell report-table__cell--date"
                                                data-label={t(
                                                    'transaction-date'
                                                )}
                                            >
                                                {dayjs(
                                                    payment.paymentDate
                                                ).format('DD.MM.YYYY')}
                                            </TableCell>
                                            <TableCell
                                                className="report-table__cell report-table__cell--order"
                                                data-label={t('order')}
                                            >
                                                <Link
                                                    className="report-table__order-link"
                                                    to={`/dashboard?orderId=${payment.orderId}`}
                                                >
                                                    {payment.orderName}
                                                </Link>
                                                <span className="report-table__order-tracking">
                                                    {payment.trackingId}
                                                </span>
                                            </TableCell>
                                            <TableCell
                                                className="report-table__cell"
                                                data-label={t('payer')}
                                            >
                                                {payment.payer}
                                            </TableCell>
                                            <TableCell
                                                className="report-table__cell"
                                                data-label={t('payment-method')}
                                            >
                                                {methodLabel(
                                                    payment.paymentMethod
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className="report-table__cell report-table__cell--amount"
                                                data-label={t('amount')}
                                            >
                                                {formatCurrency(payment.amount)}
                                            </TableCell>
                                            <TableCell
                                                className="report-table__cell report-table__cell--note"
                                                data-label={t('note')}
                                                title={
                                                    payment.note || undefined
                                                }
                                            >
                                                {payment.note || '-'}
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

export default PaymentsTab;

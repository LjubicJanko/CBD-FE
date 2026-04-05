import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as Styled from './Reports.styles';
import AuthContext from '../../store/AuthProvider/Auth.context';
import reportsService from '../../api/services/reports';
import { OrderReport, StatusDurationReport } from '../../types/Report';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import { statusColors } from '../../util/util';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency: 'RSD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const formatDuration = (hours: number): string => {
    if (hours < 1) {
        return `${Math.round(hours * 60)}m`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    if (days === 0) {
        return `${remainingHours}h`;
    }
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
};

const STATUS_COLOR_MAP: Record<string, string> = {
    ...statusColors,
};

const CustomTooltip = ({
    active,
    payload,
    t,
}: {
    active?: boolean;
    payload?: {
        payload: {
            status: string;
            percentage: number;
            averageHours: number;
        };
    }[];
    t: (key: string) => string;
}) => {
    if (!active || !payload?.length) return null;
    const { status, percentage, averageHours } = payload[0].payload;
    return (
        <div
            style={{
                background: '#3a3a3a',
                border: '1px solid #D4FF00',
                borderRadius: 10,
                padding: '10px 14px',
                color: '#fff',
                fontSize: 13,
                lineHeight: 1.6,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
        >
            <div style={{ fontWeight: 700, marginBottom: 2 }}>{t(status)}</div>
            <div style={{ color: '#D4FF00' }}>
                {percentage.toFixed(1)}%
            </div>
            <div style={{ color: '#979797' }}>
                Avg: {formatDuration(averageHours)}
            </div>
        </div>
    );
};

const RADIAN = Math.PI / 180;
const renderCustomLabel = ((props: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percentage: number;
}) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percentage } = props;
    if (percentage < 5) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text
            x={x}
            y={y}
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fontWeight={600}
        >
            {`${percentage.toFixed(0)}%`}
        </text>
    );
}) as unknown as (typeof Pie.prototype)['props']['label'];

const ReportsPage = () => {
    const { authData } = useContext(AuthContext);
    const { t } = useTranslation();

    const [from, setFrom] = useState<Dayjs>(dayjs().startOf('month'));
    const [to, setTo] = useState<Dayjs>(dayjs().endOf('month'));
    const [report, setReport] = useState<OrderReport | null>(null);
    const [durationReport, setDurationReport] =
        useState<StatusDurationReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isAdmin = useMemo(
        () => authData?.roles?.includes('admin') ?? false,
        [authData?.roles]
    );

    const fromStr = useMemo(() => from.format('YYYY-MM-DD'), [from]);
    const toStr = useMemo(() => to.format('YYYY-MM-DD'), [to]);

    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        try {
            const [orderData, durationData] = await Promise.all([
                reportsService.getOrderReport({
                    from: fromStr,
                    to: toStr,
                }),
                reportsService.getStatusDurationReport({
                    from: fromStr,
                    to: toStr,
                }),
            ]);
            setReport(orderData);
            setDurationReport(durationData);
        } catch {
            setReport(null);
            setDurationReport(null);
        } finally {
            setIsLoading(false);
        }
    }, [fromStr, toStr]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Styled.ReportsContainer className="reports-page">
                <div className="reports-page__header">
                    <h1 className="reports-page__title">{t('reports')}</h1>
                    <div className="reports-page__date-range">
                        <DatePicker
                            label={t('from')}
                            value={from}
                            onChange={(val) => val && setFrom(val)}
                            format="DD.MM.YYYY"
                            slotProps={{
                                textField: { size: 'small' },
                            }}
                        />
                        <DatePicker
                            label={t('to')}
                            value={to}
                            onChange={(val) => val && setTo(val)}
                            format="DD.MM.YYYY"
                            slotProps={{
                                textField: { size: 'small' },
                            }}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <CircularProgress
                        sx={{ alignSelf: 'center', color: '#D4FF00', mt: 4 }}
                    />
                ) : (
                    <>
                        {report && (
                            <Styled.Section>
                                <Styled.SectionHeader>
                                    <h2 className="section__title">
                                        {t('overview')}
                                    </h2>
                                </Styled.SectionHeader>
                                <Styled.StatsGrid>
                                    <Styled.StatCard $accent>
                                        <span className="stat-card__label">
                                            {t('total-orders')}
                                        </span>
                                        <span className="stat-card__value">
                                            {report.orderCount}
                                        </span>
                                    </Styled.StatCard>
                                    <Styled.StatCard>
                                        <span className="stat-card__label">
                                            {t('total-acquisition-cost')}
                                        </span>
                                        <span className="stat-card__value">
                                            {formatCurrency(
                                                report.totalAcquisitionCost
                                            )}
                                        </span>
                                    </Styled.StatCard>
                                    <Styled.StatCard>
                                        <span className="stat-card__label">
                                            {t('avg-acquisition-cost')}
                                        </span>
                                        <span className="stat-card__value">
                                            {formatCurrency(
                                                report.averageAcquisitionCost
                                            )}
                                        </span>
                                    </Styled.StatCard>

                                    {isAdmin &&
                                        report.totalAmountPaid !== null && (
                                            <>
                                                <Styled.StatCard>
                                                    <span className="stat-card__label">
                                                        {t('total-collected')}
                                                    </span>
                                                    <span className="stat-card__value">
                                                        {formatCurrency(
                                                            report.totalAmountPaid!
                                                        )}
                                                    </span>
                                                </Styled.StatCard>
                                                <Styled.StatCard>
                                                    <span className="stat-card__label">
                                                        {t('total-sale-price')}
                                                    </span>
                                                    <span className="stat-card__value">
                                                        {formatCurrency(
                                                            report.totalSalePrice!
                                                        )}
                                                    </span>
                                                </Styled.StatCard>
                                                <Styled.StatCard>
                                                    <span className="stat-card__label">
                                                        {t('outstanding')}
                                                    </span>
                                                    <span className="stat-card__value">
                                                        {formatCurrency(
                                                            report.totalOutstanding!
                                                        )}
                                                    </span>
                                                </Styled.StatCard>
                                                <Styled.StatCard $accent>
                                                    <span className="stat-card__label">
                                                        {t('profit-margin')}
                                                    </span>
                                                    <span className="stat-card__value">
                                                        {formatCurrency(
                                                            report.profitMargin!
                                                        )}
                                                    </span>
                                                </Styled.StatCard>
                                            </>
                                        )}
                                </Styled.StatsGrid>
                            </Styled.Section>
                        )}

                        <Styled.Section>
                            <Styled.SectionHeader>
                                <h2 className="section__title">
                                    {t('status-duration')}
                                </h2>
                                {durationReport &&
                                    durationReport.totalOrdersAnalyzed > 0 && (
                                        <span className="section__subtitle">
                                            {t('total-orders-analyzed')}:{' '}
                                            {durationReport.totalOrdersAnalyzed}
                                        </span>
                                    )}
                            </Styled.SectionHeader>

                            {!durationReport ||
                            durationReport.totalOrdersAnalyzed === 0 ? (
                                <Styled.ChartCard>
                                    <Styled.NoData>
                                        {t('no-completed-orders')}
                                    </Styled.NoData>
                                </Styled.ChartCard>
                            ) : (
                                <Styled.ChartCard>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={380}
                                    >
                                        <PieChart>
                                            <Pie
                                                data={
                                                    durationReport.statusDurations
                                                }
                                                dataKey="percentage"
                                                nameKey="status"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={140}
                                                innerRadius={70}
                                                paddingAngle={3}
                                                stroke="none"
                                                label={renderCustomLabel}
                                                labelLine={false}
                                            >
                                                {durationReport.statusDurations.map(
                                                    (entry) => (
                                                        <Cell
                                                            key={entry.status}
                                                            fill={
                                                                STATUS_COLOR_MAP[
                                                                    entry.status
                                                                ] || '#888'
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                            <Tooltip
                                                content={<CustomTooltip t={t} />}
                                            />
                                            <Legend
                                                verticalAlign="bottom"
                                                iconType="circle"
                                                iconSize={10}
                                                formatter={(value: string) => (
                                                    <span
                                                        style={{
                                                            color: '#fff',
                                                            fontSize: 13,
                                                        }}
                                                    >
                                                        {t(value)}
                                                    </span>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Styled.ChartCard>
                            )}
                        </Styled.Section>
                    </>
                )}
            </Styled.ReportsContainer>
        </LocalizationProvider>
    );
};

export default ReportsPage;

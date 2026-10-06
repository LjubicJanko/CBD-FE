import { Tab, Tabs } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PaymentsTab from '../../components/payments-tab/PaymentsTab.component';
import UnpaidOrdersTab from '../../components/unpaid-orders-tab/UnpaidOrdersTab.component';
import ReportFilterChip from '../../components/report-table/ReportFilterChip.component';
import useQueryParams from '../../hooks/useQueryParams';
import theme from '../../styles/theme';
import * as Styled from './ReportsPayments.styles';

type ReportTab = 'payments' | 'unpaid';

const DATE_FORMAT = 'YYYY-MM-DD';
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const parseDate = (value: string | undefined): Dayjs | null => {
    if (!value || !ISO_DATE.test(value)) return null;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
};

const ReportsPaymentsPage = () => {
    const { t } = useTranslation();
    const { params, setQParam, setMultipleQParams, removeMultipleQParams } =
        useQueryParams<{
            tab: string;
            from: string;
            to: string;
        }>();

    const tab: ReportTab = params.tab === 'unpaid' ? 'unpaid' : 'payments';

    // Default view is the whole history: no `from`, and `to` is today. Neither
    // bound can be after today.
    const todayStr = dayjs().format(DATE_FORMAT);
    const today = useMemo(() => dayjs(todayStr), [todayStr]);
    const from = useMemo(() => {
        const parsed = parseDate(params.from);
        return parsed && parsed.isAfter(today, 'day') ? today : parsed;
    }, [params.from, today]);
    const to = useMemo(() => {
        const parsed = parseDate(params.to);
        return parsed && !parsed.isAfter(today, 'day') ? parsed : today;
    }, [params.to, today]);
    const fromStr = from?.format(DATE_FORMAT);
    const toStr = to.format(DATE_FORMAT);
    const isRangeValid = !from || !from.isAfter(to, 'day');

    const setBound = (key: 'from' | 'to', value: Dayjs) =>
        setMultipleQParams({
            [key]: (value.isAfter(today, 'day') ? today : value).format(
                DATE_FORMAT
            ),
        });

    const showAllHistory = () => removeMultipleQParams(['from', 'to']);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Styled.PaymentsReportContainer className="reports-page">
                <div className="reports-page__header">
                    <div className="reports-page__heading">
                        <Link to="/reports" className="reports-page__back">
                            {t('back-to-reports')}
                        </Link>
                        <h1 className="reports-page__title">
                            {t('payments-report')}
                        </h1>
                    </div>
                    <div className="reports-page__date-range">
                        <DatePicker
                            label={t('from')}
                            value={from}
                            maxDate={today}
                            onChange={(val) => {
                                if (val?.isValid()) setBound('from', val);
                            }}
                            format="DD.MM.YYYY"
                            slotProps={{ textField: { size: 'small' } }}
                        />
                        <DatePicker
                            label={t('to')}
                            value={to}
                            maxDate={today}
                            onChange={(val) => {
                                if (val?.isValid()) setBound('to', val);
                            }}
                            format="DD.MM.YYYY"
                            slotProps={{ textField: { size: 'small' } }}
                        />
                        <ReportFilterChip
                            label={t('show-all-history')}
                            isActive={!from}
                            onClick={showAllHistory}
                        />
                    </div>
                    {!isRangeValid && (
                        <p role="alert" className="reports-page__error">
                            {t('invalid-date-range')}
                        </p>
                    )}
                </div>

                <Tabs
                    className="reports-page__tabs"
                    value={tab}
                    onChange={(_event, value: ReportTab) =>
                        setQParam('tab', value)
                    }
                    textColor="inherit"
                    TabIndicatorProps={{
                        style: { backgroundColor: theme.PRIMARY_2 },
                    }}
                    sx={{
                        color: theme.SECONDARY_1,
                        minHeight: 40,
                        '& .MuiTab-root': { minHeight: 40 },
                    }}
                >
                    <Tab value="payments" label={t('payments')} />
                    <Tab value="unpaid" label={t('unpaid-orders')} />
                </Tabs>

                {tab === 'payments' ? (
                    <PaymentsTab
                        from={fromStr}
                        to={toStr}
                        isRangeValid={isRangeValid}
                    />
                ) : (
                    <UnpaidOrdersTab
                        from={fromStr}
                        to={toStr}
                        isRangeValid={isRangeValid}
                    />
                )}
            </Styled.PaymentsReportContainer>
        </LocalizationProvider>
    );
};

export default ReportsPaymentsPage;

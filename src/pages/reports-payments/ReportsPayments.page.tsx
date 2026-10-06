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
import useQueryParams from '../../hooks/useQueryParams';
import theme from '../../styles/theme';
import * as Styled from './ReportsPayments.styles';

type ReportTab = 'payments' | 'unpaid';

const DATE_FORMAT = 'YYYY-MM-DD';
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const parseDate = (value: string | undefined, fallback: Dayjs): Dayjs => {
    if (!value || !ISO_DATE.test(value)) return fallback;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : fallback;
};

const ReportsPaymentsPage = () => {
    const { t } = useTranslation();
    const { params, setQParam, setMultipleQParams } = useQueryParams<{
        tab: string;
        from: string;
        to: string;
    }>();

    const tab: ReportTab = params.tab === 'unpaid' ? 'unpaid' : 'payments';
    const from = useMemo(
        () => parseDate(params.from, dayjs().startOf('month')),
        [params.from]
    );
    const to = useMemo(
        () => parseDate(params.to, dayjs().endOf('month')),
        [params.to]
    );
    const fromStr = from.format(DATE_FORMAT);
    const toStr = to.format(DATE_FORMAT);
    const isRangeValid = !from.isAfter(to, 'day');

    const setRange = (nextFrom: Dayjs, nextTo: Dayjs) =>
        setMultipleQParams({
            from: nextFrom.format(DATE_FORMAT),
            to: nextTo.format(DATE_FORMAT),
        });

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
                            onChange={(val) => {
                                if (val?.isValid()) setRange(val, to);
                            }}
                            format="DD.MM.YYYY"
                            slotProps={{ textField: { size: 'small' } }}
                        />
                        <DatePicker
                            label={t('to')}
                            value={to}
                            onChange={(val) => {
                                if (val?.isValid()) setRange(from, val);
                            }}
                            format="DD.MM.YYYY"
                            slotProps={{ textField: { size: 'small' } }}
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

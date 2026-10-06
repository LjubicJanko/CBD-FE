import {
    OrderReport,
    PaymentsReport,
    PaymentsReportMethodFilter,
    StatusDurationReport,
    UnpaidOrdersReport,
} from '../../types/Report';
import { SortType } from '../../components/modals/filters/FiltersModal.component';
import privateClient from '../privateClient';

export type FetchReportProps = {
    from?: string;
    to?: string;
};

const getOrderReport = async (props: FetchReportProps) =>
    privateClient
        .get('/reports/orders', {
            params: {
                ...(props.from && { from: props.from }),
                ...(props.to && { to: props.to }),
            },
        })
        .then((res) => res.data as OrderReport);

const getStatusDurationReport = async (props: FetchReportProps) =>
    privateClient
        .get('/reports/status-duration', {
            params: {
                ...(props.from && { from: props.from }),
                ...(props.to && { to: props.to }),
            },
        })
        .then((res) => res.data as StatusDurationReport);

export type FetchPaymentsReportProps = FetchReportProps & {
    methods?: PaymentsReportMethodFilter[];
    page?: number;
    perPage?: number;
    sort?: SortType;
};

export type FetchUnpaidOrdersReportProps = FetchReportProps & {
    withoutPaymentsInRange?: boolean;
    page?: number;
    perPage?: number;
    sort?: SortType;
};

// The BE caps perPage at 1..100 and answers 400 outside it, so never send more.
const MAX_PER_PAGE = 100;
const clampPerPage = (perPage: number) =>
    Math.min(MAX_PER_PAGE, Math.max(1, Math.floor(perPage)));

const getPaymentsReport = async (props: FetchPaymentsReportProps) =>
    privateClient
        .get('/reports/payments', {
            params: {
                ...(props.from && { from: props.from }),
                ...(props.to && { to: props.to }),
                // Comma-joined, unlike the repeated-param serializer used by
                // orders.fetchPaginated.
                ...(props.methods?.length && {
                    methods: props.methods.join(','),
                }),
                page: props.page ?? 0,
                perPage: clampPerPage(props.perPage ?? 50),
                sort: props.sort ?? 'desc',
            },
        })
        .then((res) => res.data as PaymentsReport);

const getUnpaidOrdersReport = async (props: FetchUnpaidOrdersReportProps) =>
    privateClient
        .get('/reports/unpaid-orders', {
            params: {
                ...(props.from && { from: props.from }),
                ...(props.to && { to: props.to }),
                withoutPaymentsInRange: props.withoutPaymentsInRange ?? false,
                page: props.page ?? 0,
                perPage: clampPerPage(props.perPage ?? 50),
                sort: props.sort ?? 'desc',
            },
        })
        .then((res) => res.data as UnpaidOrdersReport);

export default {
    getOrderReport,
    getStatusDurationReport,
    getPaymentsReport,
    getUnpaidOrdersReport,
};

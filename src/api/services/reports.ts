import { OrderReport, StatusDurationReport } from '../../types/Report';
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

export default {
    getOrderReport,
    getStatusDurationReport,
};

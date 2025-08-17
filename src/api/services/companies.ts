import { GetAllPaginatedResponse } from '../../types/Order';
import privateClient from '../privateClient';
import { FetchPaginatedProps } from './orders';

const getCompany = async (id: number) =>
  privateClient.get(`/company/${id}`).then((res) => res.data);

const getAll = async () =>
  privateClient.get('/company/all').then((res) => res.data);

const getCompanies = async (ids: number[]) =>
  privateClient.post('/company/getCompanies', ids).then((res) => res.data);

const getCompanyOrders = async (id: number, props: FetchPaginatedProps) =>
  privateClient
    .get(`/company/${id}/orders`, {
      params: {
        searchTerm: props.searchTerm,
        statuses: props.statuses,
        priorities: props.priorities,
        executionStatuses: props.executionStatuses,
        sortCriteria: props.sortCriteria,
        sort: props.sort,
        page: props.page ?? 0,
        perPage: props.perPage ?? 5,
      },
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();

        // Serialize statuses
        if (params.statuses) {
          params.statuses.forEach((status: string) =>
            searchParams.append('statuses', status)
          );
        }

        // Serialize priorities
        if (params.priorities) {
          params.priorities.forEach((priority: string) =>
            searchParams.append('priorities', priority)
          );
        }

        // Serialize executionStatuses
        if (params.executionStatuses) {
          params.executionStatuses.forEach((executionStatus: string) =>
            searchParams.append('executionStatuses', executionStatus)
          );
        }

        // Serialize pagination params
        searchParams.append(
          'sortCriteria',
          (props.sortCriteria ?? 'expected-date').toString()
        );
        searchParams.append('searchTerm', (props.searchTerm ?? '').toString());
        searchParams.append('sort', (props.sort ?? 'desc').toString());
        searchParams.append('page', (props.page ?? 0).toString());
        searchParams.append('perPage', (props.perPage ?? 5).toString());

        return searchParams.toString();
      },
    })
    .then((res) => res.data as GetAllPaginatedResponse);


export default {
  getCompanies,
  getAll,
  getCompany,
  getCompanyOrders
};

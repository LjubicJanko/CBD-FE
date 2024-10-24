import { StatusData } from '../../components/modals/status-change/StatusChangeModal.component';
import { CreateOrder, GetAllPaginatedResponse } from '../../types/Order';
import client from '../client';
import privateClient from '../privateClient';

export type GetAllPaginatedProps = {
  statuses?: string[];
  page?: number;
  perPage?: number;
};

export type SearchProps = {
  statuses?: string[];
  page?: number;
  perPage?: number;
};

const trackOrder = async (trackingId: string) =>
  client.get('/orders/track/' + trackingId).then((res) => res.data);

const getOrder = async (id: number) =>
  privateClient.get('/orders/get/' + id).then((res) => res.data);

const getAll = async (statuses?: string[]) =>
  privateClient
    .get('/orders/get', {
      params: { statuses },
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        if (params.statuses) {
          params.statuses.forEach((status: string) =>
            searchParams.append('statuses', status)
          );
        }
        return searchParams.toString();
      },
    })
    .then((res) => res.data);

const getAllPaginated = async (props: GetAllPaginatedProps) =>
  privateClient
    .get('/orders/getPageable', {
      params: {
        statuses: props.statuses,
        page: props.page ?? 0,
        perPage: props.perPage ?? 5,
      },
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        if (params.statuses) {
          params.statuses.forEach((status: string) =>
            searchParams.append('statuses', status)
          );
          searchParams.append('page', (props.page ?? 0).toString());
          searchParams.append('perPage', (props.perPage ?? 0).toString());
        }
        return searchParams.toString();
      },
    })
    .then((res) => res.data as GetAllPaginatedResponse);

const changeStatus = async (id?: number, statusData?: StatusData) => {
  const {
    closingComment = '',
    postalCode = '',
    postalService = '',
  } = statusData ?? {};

  return privateClient
    .post(`/orders/changeStatus/${id}`, {
      closingComment,
      postalCode,
      postalService,
    })
    .then((res) => res.data);
};

const searchOrders = async (props: GetAllPaginatedProps) =>
  privateClient
    .get('/orders/search', {
      params: {
        searchTerm,
      },
    })
    .then((res) => res.data);

const createOrder = async (data: CreateOrder) =>
  privateClient.post('/orders/create', data).then((res) => res.data);

export default {
  getOrder,
  trackOrder,
  getAll,
  getAllPaginated,
  changeStatus,
  searchOrders,
  createOrder,
};

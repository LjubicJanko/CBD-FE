import { AxiosError } from 'axios';
import { StatusData } from '../../components/modals/status-change/StatusChangeModal.component';
import {
  CreateOrder,
  GetAllPaginatedResponse,
  Order,
  OrderExecutionStatus,
} from '../../types/Order';
import { Payment } from '../../types/Payment';
import { ApiError } from '../../types/Response';
import client from '../client';
import privateClient from '../privateClient';

export type GetAllPaginatedProps = {
  statuses?: string[];
  executionStatuses?: string[];
  sort?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
};

export type SearchProps = {
  searchTerm?: string;
  page?: number;
  perPage?: number;
};

const trackOrder = async (trackingId: string) => {
  try {
    const response = await client.get(`/orders/track/${trackingId}`);
    return response.data; // Return the tracking data if successful
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response) {
      const status = axiosError.response.status;

      if (status === 404) {
        throw new Error('order-not-found');
      } else {
        throw new Error(
          `An error occurred while tracking the order: ${
            axiosError.response.data?.description || 'Unknown error.'
          }`
        );
      }
    }

    throw new Error('A network error occurred. Please try again later.');
  }
};

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
        executionStatuses: props.executionStatuses,
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

        // Serialize executionStatuses
        if (params.executionStatuses) {
          params.executionStatuses.forEach((executionStatus: string) =>
            searchParams.append('executionStatuses', executionStatus)
          );
        }

        // Serialize pagination params
        searchParams.append('sort', (props.sort ?? 'desc').toString());
        searchParams.append('page', (props.page ?? 0).toString());
        searchParams.append('perPage', (props.perPage ?? 5).toString());

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

const searchOrders = async (props: SearchProps) =>
  privateClient
    .get('/orders/search', {
      params: {
        searchTerm: props?.searchTerm,
        page: props.page ?? 0,
        perPage: props.perPage ?? 5,
      },
    })
    .then((res) => res.data);

const createOrder = async (data: CreateOrder) =>
  privateClient.post('/orders/create', data).then((res) => res.data);

const updateOrder = async (order: Order) =>
  privateClient.put(`/orders/${order.id}`, order).then((res) => res.data);

const changeExecutionStatus = async (
  id: number,
  executionStatus: OrderExecutionStatus,
  note: string
) => {
  return privateClient
    .put(`/orders/changeExecutionStatus/${id}`, {
      executionStatus,
      note,
    })
    .then((res) => res.data);
};

const deleteOrder = async (id: number) => {
  return privateClient.delete(`/orders/delete/${id}`);
};

const pauseOrder = async (id: number, pauseComment: string) =>
  privateClient
    .put(`/orders/pause/${id}`, { pausingComment: pauseComment })
    .then((res) => res.data);

const reactivateOrder = async (id: number) =>
  privateClient.put(`/orders/reactivate/${id}`).then((res) => res.data);

const addPayment = async (payment: Payment, orderId: number) =>
  privateClient
    .post(`/orders/addPayment/${orderId}`, payment)
    .then((res) => res.data);

const editPayment = async (payment: Payment, orderId: number) =>
  privateClient
    .put(`/orders/editPayment/${orderId}`, payment)
    .then((res) => res.data);

const deletePayment = async (id: number, paymentId: number) =>
  privateClient
    .put(`/orders/deletePayment/${id}?paymentId=${paymentId}`)
    .then((res) => res.data);

export default {
  getOrder,
  trackOrder,
  getAll,
  getAllPaginated,
  changeStatus,
  searchOrders,
  createOrder,
  updateOrder,
  changeExecutionStatus,
  deleteOrder,
  pauseOrder,
  reactivateOrder,
  addPayment,
  editPayment,
  deletePayment,
};

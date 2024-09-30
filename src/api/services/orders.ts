import { StatusData } from '../../components/modals/status-change/StatusChangeModal.component';
import client from '../client';
import privateClient from '../privateClient';

const getOrder = async (id: number) =>
  client.get('/orders/get/' + id).then((res) => res.data);

const trackOrder = async (trackingId: string) =>
  client.get('/orders/track/' + trackingId).then((res) => res.data);

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

const searchOrders = async (searchTerm: string) =>
  privateClient
    .get('/orders/search', {
      params: {
        searchTerm,
      },
    })
    .then((res) => res.data);

export default {
  getOrder,
  trackOrder,
  getAll,
  changeStatus,
  searchOrders,
};

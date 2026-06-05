import {
  WorkLocation,
  WorkLocationPatchRequest,
  WorkLocationRequest,
} from '../../types/WorkLocation';
import privateClient from '../privateClient';

const list = async (activeOnly = false): Promise<WorkLocation[]> =>
  privateClient
    .get('/locations', { params: { activeOnly } })
    .then((res) => res.data);

const create = async (data: WorkLocationRequest): Promise<WorkLocation> =>
  privateClient.post('/locations', data).then((res) => res.data);

const patch = async (
  id: number,
  data: WorkLocationPatchRequest
): Promise<WorkLocation> =>
  privateClient.patch(`/locations/${id}`, data).then((res) => res.data);

const remove = async (id: number): Promise<void> =>
  privateClient.delete(`/locations/${id}`).then((res) => res.data);

export default {
  list,
  create,
  patch,
  remove,
};

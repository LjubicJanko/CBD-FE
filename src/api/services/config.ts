import { GenericConfig } from '../../types/GenericConfig';
import privateClient from '../privateClient';

const getAllConfigs = async (): Promise<GenericConfig[]> => {
  return privateClient.get('/config').then((res) => res.data);
};

const getConfigsByType = async (type: string): Promise<GenericConfig[]> => {
  return privateClient.get(`/config/type/${type}`).then((res) => res.data);
};

const createConfig = async (config: GenericConfig): Promise<GenericConfig> => {
  return privateClient.post('/config/create', config).then((res) => res.data);
};

const updateConfig = async (
  id: number,
  config: GenericConfig
): Promise<GenericConfig> => {
  return privateClient.put(`/config/${id}`, config).then((res) => res.data);
};

const bulkUpdateConfigs = async (
  type: string,
  configs: GenericConfig[]
): Promise<GenericConfig[]> => {
  return privateClient
    .put(`/config/bulk/${type}`, configs)
    .then((res) => res.data);
};

const deleteConfig = async (id: number): Promise<void> => {
  return privateClient.delete(`/config/${id}`).then((res) => res.data);
};

export default {
  getAllConfigs,
  getConfigsByType,
  createConfig,
  updateConfig,
  bulkUpdateConfigs,
  deleteConfig,
};

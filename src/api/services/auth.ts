import { LoginData, Role } from '../../types/Auth';
import client from '../client';

export interface LoginResponse {
  id: number;
  name: string;
  username: string;
  token: string;
  roles: Role[];
  privileges: string[];
}

export const login = async (data: LoginData): Promise<LoginResponse> =>
  client.post<LoginResponse>('/auth/login', data).then((res) => res.data);

export default {
  login,
};

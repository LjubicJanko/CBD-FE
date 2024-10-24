import { LoginData, RegisterData, Role } from '../../types/Auth';
import client from '../client';

interface LoginResponse {
  id: number;
  token: string;
  roles: Role[];
  privileges: string[];
}

export const login = async (data: LoginData): Promise<LoginResponse> =>
  client.post<LoginResponse>('/auth/login', data).then((res) => res.data);

export const signup = async (data: RegisterData): Promise<LoginResponse> =>
  client.post<LoginResponse>('/auth/signup', data).then((res) => res.data);

export default {
  login,
  signup,
};

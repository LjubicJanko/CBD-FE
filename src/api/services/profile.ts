import { ChangePasswordData, RegisterData, User } from '../../types/Auth';
import privateClient from '../privateClient';
import { LoginResponse } from './auth';

export const signup = async (data: RegisterData): Promise<LoginResponse> =>
  privateClient
    .post<LoginResponse>('/profile/signup', data)
    .then((res) => res.data);

export const getAllUsers = async () =>
  privateClient.get('/profile/admin/allUsers').then((res) => res.data);

export const changePassword = async (data: ChangePasswordData): Promise<User> =>
  privateClient.put('/profile/change-password', data).then((res) => res.data);

export default {
  signup,
  getAllUsers,
  changePassword
};

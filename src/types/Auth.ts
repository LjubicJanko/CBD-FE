export type Role = 'admin' | 'manager' | 'manufacturer' | 'consumer';

export type AuthData = {
  id: number;
  name: string;
  username: string;
  token: string;
  roles: Role[];
  privileges: string[];
};

export type LoginData = {
  username: string;
  password: string;
};

export type RegisterData = LoginData & {
  fullName: string;
  role: string;
};

export type ChangePasswordData = {
  username: string;
  oldPassword: string;
  newPassword: string;
};

export type User = {
  fullName: string;
  username: string;
  createdAt: string;
  roles: {
    name: string;
  }[];
};

export type Role = 'admin' | 'manager' | 'manufacturer' | 'consumer';

export type AuthData = {
  id: number;
  name: string;
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

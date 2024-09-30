export type AuthData = {
  id: number;
  token: string;
  roles: "admin" | "manager" | "manufacturer" | "consumer";
};

export type LoginData = {
  username: string;
  password: string;
};

export type RegisterData = LoginData & {
  fullName: string;
};

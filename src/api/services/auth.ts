import { LoginData, RegisterData } from "../../types/Auth";
import client from "../client";

interface LoginResponse {
  token: string;
  id: number;
  roles: "admin" | "manager" | "manufacturer" | "consumer";
}

export const login = async (data: LoginData): Promise<LoginResponse> =>
  client.post<LoginResponse>("/auth/login", data).then((res) => res.data);

export const signup = async (data: RegisterData): Promise<LoginResponse> =>
  client.post<LoginResponse>("/auth/signup", data).then((res) => res.data);

export default {
  login,
  signup,
};

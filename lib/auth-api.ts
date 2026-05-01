import { api } from "@/lib/api";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  uname: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  data: {
    token: string;
    name: string;
  };
};

export async function loginAdmin(payload: LoginPayload) {
  const response = await api.post<LoginResponse>("/auth/login", payload);
  return response.data;
}

export async function registerAdmin(payload: RegisterPayload) {
  const response = await api.post("/auth/register-admin", payload);
  return response.data;
}

export function saveAuth(token: string, name: string) {
  localStorage.setItem("hms_admin_token", token);
  localStorage.setItem("hms_admin_name", name);
}

export function logoutAdmin() {
  localStorage.removeItem("hms_admin_token");
  localStorage.removeItem("hms_admin_name");
}
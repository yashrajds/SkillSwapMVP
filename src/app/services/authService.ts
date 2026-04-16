import { api } from "./api";
import type { AuthResponse, LoginPayload, RegisterPayload } from "./types";

export const authService = {
  async register(payload: RegisterPayload) {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  async login(payload: LoginPayload) {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },
};

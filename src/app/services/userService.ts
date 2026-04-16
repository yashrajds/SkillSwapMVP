import { api } from "./api";
import type { UpdateProfilePayload, User } from "./types";

export const userService = {
  async getUsers() {
    const { data } = await api.get<User[]>("/user");
    return data;
  },

  async getProfile() {
    const { data } = await api.get<User>("/user/profile");
    return data;
  },

  async updateProfile(payload: UpdateProfilePayload) {
    const { data } = await api.put<User>("/user/profile", payload);
    return data;
  },
};

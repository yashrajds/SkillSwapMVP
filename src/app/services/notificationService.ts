import { api } from "./api";
import type { Notification } from "./types";

export const notificationService = {
  async getNotifications() {
    const { data } = await api.get<Notification[]>("/notifications");
    return data;
  },

  async markRead(id: string) {
    const { data } = await api.put<Notification>(`/notifications/${id}/read`);
    return data;
  },

  async markAllRead() {
    const { data } = await api.put<Notification[]>("/notifications/read-all");
    return data;
  },
};

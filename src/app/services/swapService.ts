import { api } from "./api";
import type { CreateSwapPayload, SwapRequest } from "./types";

export const swapService = {
  async createSwap(payload: CreateSwapPayload) {
    const { data } = await api.post<SwapRequest>("/swaps", payload);
    return data;
  },

  async getSwaps() {
    const { data } = await api.get<SwapRequest[]>("/swaps");
    return data;
  },

  async updateSwapStatus(id: string, status: "accepted" | "rejected") {
    const { data } = await api.put<SwapRequest>(`/swaps/${id}`, { status });
    return data;
  },
};

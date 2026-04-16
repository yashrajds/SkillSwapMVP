import { api } from "./api";
import type { CreatePostPayload, Post } from "./types";

export const postService = {
  async getPosts() {
    const { data } = await api.get<Post[]>("/posts");
    return data;
  },

  async createPost(payload: CreatePostPayload) {
    const { data } = await api.post<Post>("/posts", payload);
    return data;
  },

  async toggleLike(id: string) {
    const { data } = await api.put<Post>(`/posts/${id}/like`);
    return data;
  },

  async toggleSave(id: string) {
    const { data } = await api.put<Post>(`/posts/${id}/save`);
    return data;
  },
};

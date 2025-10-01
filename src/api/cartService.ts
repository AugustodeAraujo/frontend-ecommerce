// src/api/cartService.ts
import api from "@/api/axios";
import type {
  CartItem,
  CartItemPayload,
  UpdateCartItemPayload,
} from "@/models/CartItem";

export const cartService = {
  async list(): Promise<CartItem[]> {
    const res = await api.get<CartItem[]>("/cart");
    return res.data;
  },

  async addItem(payload: CartItemPayload): Promise<CartItem> {
    const res = await api.post<CartItem>("/cart", payload);
    return res.data;
  },

  async updateItem(
    id: string,
    payload: UpdateCartItemPayload
  ): Promise<CartItem> {
    const res = await api.put<CartItem>(`/cart/${id}`, payload);
    return res.data;
  },

  async removeItem(id: string): Promise<void> {
    await api.delete(`/cart/${id}`);
  },
};

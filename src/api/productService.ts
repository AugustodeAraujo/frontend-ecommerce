// src/api/productService.ts
import axios from "axios";
import type { Product } from "@/models/Product";

const api = axios.create({
  baseURL: "http://localhost:3333/api",
});

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const productService = {
  async list(page: number = 1): Promise<PaginatedResponse<Product>> {
    const res = await api.get(`/products?page=${page}`);

    return res.data;
  },

  async search(query: string): Promise<PaginatedResponse<Product>> {
    const res = await api.get(`/products/search?q=${query}`);
    return {
      data: res.data,
      meta: {
        page: 1,
        limit: res.data.length,
        total: res.data.length,
        totalPages: 1,
      },
    };
  },
};

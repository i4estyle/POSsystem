import { api } from '@/boot/axios';
import type { ProductInterface } from '@/types/product';
import type { PaginatedResponse } from '@/types/api-response';

export const productService = {
  async getAll(page = 1, limit = 50): Promise<PaginatedResponse<ProductInterface>> {
    const response = await api.get<PaginatedResponse<ProductInterface>>('/products', {
      params: { page, limit },
    });
    return response.data;
  },

  async getById(id: number): Promise<ProductInterface> {
    const response = await api.get<ProductInterface>(`/products/${id}`);
    return response.data;
  },
};

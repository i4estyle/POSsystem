import { api } from '@/boot/axios';
import type { CategoryInterface } from '@/types/product';
import type { PaginatedResponse } from '@/types/api-response';

export const categoryService = {
  async getAll(page = 1, limit = 50): Promise<PaginatedResponse<CategoryInterface>> {
    const response = await api.get<PaginatedResponse<CategoryInterface>>('/categories', {
      params: { page, limit },
    });
    return response.data;
  },
};

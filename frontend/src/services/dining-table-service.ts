import { api } from '@/boot/axios';
import type { DiningTableInterface } from '@/types/dining-table';
import type { PaginatedResponse } from '@/types/api-response';

export const diningTableService = {
  async getAll(page = 1, limit = 50): Promise<PaginatedResponse<DiningTableInterface>> {
    const response = await api.get<PaginatedResponse<DiningTableInterface>>('/dining-tables', {
      params: { page, limit },
    });
    return response.data;
  },
};

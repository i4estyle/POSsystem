import { api } from '@/boot/axios';
import type { BranchInterface } from '@/types/branch';
import type { PaginatedResponse } from '@/types/api-response';

export const branchService = {
  async getAll(page = 1, limit = 50): Promise<PaginatedResponse<BranchInterface>> {
    const response = await api.get<PaginatedResponse<BranchInterface>>('/branches', {
      params: { page, limit },
    });
    return response.data;
  },
};

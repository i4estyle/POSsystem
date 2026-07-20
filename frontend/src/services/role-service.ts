import { api } from '@/boot/axios';
import type { PaginatedResponse } from '@/types/api-response';

export interface RoleInterface {
  roleId: number;
  roleName: string;
  description?: string;
}

export const roleService = {
  async getAll(page = 1, limit = 50): Promise<PaginatedResponse<RoleInterface>> {
    const response = await api.get<PaginatedResponse<RoleInterface>>('/roles', {
      params: { page, limit },
    });
    return response.data;
  },
};

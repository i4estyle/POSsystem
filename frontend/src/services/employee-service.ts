import { api } from '@/boot/axios';
import type { AuthUser } from '@/types/auth';

export const employeeService = {
  async getById(id: number): Promise<AuthUser> {
    const response = await api.get<AuthUser>(`/employees/${id}`);
    return response.data;
  },

  async update(id: number, payload: Partial<AuthUser>): Promise<AuthUser> {
    const response = await api.patch<AuthUser>(`/employees/${id}`, payload);
    return response.data;
  },
};

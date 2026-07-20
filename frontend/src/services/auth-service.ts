import { api } from '@/boot/axios';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  async checkAvailability(
    field: 'username' | 'email' | 'nationalId',
    value: string,
  ): Promise<{ available: boolean; message?: string }> {
    const response = await api.post<{ available: boolean; message?: string }>(
      '/auth/check-availability',
      { field, value },
    );
    return response.data;
  },
};

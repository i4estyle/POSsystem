import { api } from '@/boot/axios';
import type { CreateOrderDto, OrderInterface } from '@/types/order';

export const orderService = {
  async create(dto: CreateOrderDto): Promise<OrderInterface> {
    const response = await api.post<OrderInterface>('/orders', dto);
    return response.data;
  },
};

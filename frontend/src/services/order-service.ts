import { api } from '@/boot/axios';
import type { CreateOrderDto, OrderInterface, OrderStatus } from '@/types/order';

export interface BackendOrderItemDetail {
  orderItemId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  note?: string | null;
  product?: {
    productId: number;
    productName: string;
    imageUrl?: string | null;
  };
}

export interface BackendOrderDetail extends OrderInterface {
  tableId?: number | null;
  promotionId?: number | null;
  table?: {
    tableId: number;
    tableNumber: string;
  } | null;
  promotion?: {
    promotionId: number;
    promotionName: string;
    promotionType: 'percent' | 'fixed_amount' | 'buy_x_get_y';
    discountValue: number;
  } | null;
  items?: BackendOrderItemDetail[];
}

export interface PaginatedOrdersResponse {
  data: BackendOrderDetail[];
  total: number;
  page: number;
  limit: number;
}

export const orderService = {
  async create(dto: CreateOrderDto): Promise<BackendOrderDetail> {
    const response = await api.post<BackendOrderDetail>('/orders', dto);
    return response.data;
  },

  async findAll(limit = 50): Promise<BackendOrderDetail[]> {
    const response = await api.get<PaginatedOrdersResponse>('/orders', {
      params: { page: 1, limit },
    });
    return response.data?.data ?? [];
  },

  async updateStatus(orderId: number, status: OrderStatus): Promise<BackendOrderDetail> {
    const response = await api.patch<BackendOrderDetail>(`/orders/${orderId}/status`, {
      status,
    });
    return response.data;
  },
};

import { api } from '@/boot/axios';
import type { CreateOrderDto } from '@/types/order';
import type { BackendOrderDetail } from './order-service';

interface QrCodeResponse {
  qrCodeId: number;
  branchId: number;
  tableId?: number | null;
  codeToken: string;
}

export interface TableSessionResponse {
  sessionId: number;
  qrCodeId: number;
  tableId?: number | null;
  guestCount: number;
  sessionStatus: 'active' | 'closed';
  startedAt: string;
}

export interface TableRequestResponse {
  requestId: number;
  sessionId: number;
  tableId: number;
  requestType: 'call_staff' | 'request_bill' | 'request_water' | 'other';
  status: 'pending' | 'acknowledged' | 'done';
}

export const qrOrderService = {
  async getOrCreateForTable(branchId: number, tableId: number): Promise<QrCodeResponse> {
    const list = await api.get<{ data: QrCodeResponse[] }>('/qr-orders/qr-codes', {
      params: { page: 1, limit: 100 },
    });
    const existing = list.data.data.find((qr) => qr.tableId === tableId);
    if (existing) return existing;
    const created = await api.post<QrCodeResponse>('/qr-orders/qr-codes', {
      branchId,
      tableId,
      qrType: 'dine_in',
    });
    return created.data;
  },

  async createSession(token: string, guestCount: number): Promise<TableSessionResponse> {
    const response = await api.post<TableSessionResponse>(
      `/qr-orders/public/${encodeURIComponent(token)}/sessions`,
      { guestCount },
    );
    return response.data;
  },

  async closeSession(sessionId: number): Promise<TableSessionResponse> {
    const response = await api.patch<TableSessionResponse>(`/qr-orders/sessions/${sessionId}`, {
      sessionStatus: 'closed',
    });
    return response.data;
  },

  async createTableRequest(
    token: string,
    payload: {
      sessionId: number;
      requestType: 'call_staff' | 'request_bill' | 'request_water' | 'other';
    },
  ): Promise<TableRequestResponse> {
    const response = await api.post<TableRequestResponse>(
      `/qr-orders/public/${encodeURIComponent(token)}/sessions/${payload.sessionId}/requests`,
      { requestType: payload.requestType },
    );
    return response.data;
  },

  async createOrder(
    token: string,
    sessionId: number,
    payload: CreateOrderDto,
  ): Promise<BackendOrderDetail> {
    const response = await api.post<BackendOrderDetail>(
      `/qr-orders/public/${encodeURIComponent(token)}/sessions/${sessionId}/orders`,
      payload,
    );
    return response.data;
  },

  async getPublicOrders(
    token: string,
    sessionId?: number,
    tableId?: number,
  ): Promise<BackendOrderDetail[]> {
    const params: Record<string, number> = {};
    if (sessionId) params.sessionId = sessionId;
    if (tableId) params.tableId = tableId;
    const response = await api.get<BackendOrderDetail[]>(
      `/qr-orders/public/${encodeURIComponent(token)}/orders`,
      { params },
    );
    return response.data;
  },
};

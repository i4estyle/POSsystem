import { api } from '@/boot/axios';

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
  async createSession(payload: {
    qrCodeId: number;
    tableId?: number;
    guestCount?: number;
  }): Promise<TableSessionResponse> {
    const response = await api.post<TableSessionResponse>('/qr-orders/sessions', payload);
    return response.data;
  },

  async closeSession(sessionId: number): Promise<TableSessionResponse> {
    const response = await api.patch<TableSessionResponse>(`/qr-orders/sessions/${sessionId}`, {
      sessionStatus: 'closed',
    });
    return response.data;
  },

  async createTableRequest(payload: {
    sessionId: number;
    tableId: number;
    requestType: 'call_staff' | 'request_bill' | 'request_water' | 'other';
  }): Promise<TableRequestResponse> {
    const response = await api.post<TableRequestResponse>('/qr-orders/requests', payload);
    return response.data;
  },
};

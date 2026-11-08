export type KanbanStatus = 'new' | 'preparing' | 'ready' | 'served';
export type OrderFilterValue = 'all' | KanbanStatus;
export type OrderSortOrder = 'newest' | 'oldest';
export type OrderTypeKey = 'dineIn' | 'takeaway';
export type OrderItemKey =
  | 'lavenderLatte'
  | 'butterCroissant'
  | 'kyotoMatchaLatte'
  | 'icedLatte'
  | 'belgianWaffle'
  | 'cappuccino'
  | 'avocadoToast'
  | 'americano'
  | 'matchaLatte'
  | 'croissant'
  | 'eggsBenedict'
  | 'flatWhite';

export interface OrderKanbanItem {
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string | null;
}
export interface OrderKanbanTicket {
  status: KanbanStatus;
  orderNumber: string;
  time: string;
  tableLabel: string;
  orderType: string;
  subtotal?: number | undefined;
  discountAmount?: number | undefined;
  taxAmount?: number | undefined;
  promotionLabel?: string | undefined;
  total: number;
  items: OrderKanbanItem[];
}
export interface OrderKanbanColumn {
  key: KanbanStatus;
  title: string;
  orders: OrderKanbanTicket[];
}
export interface OrderKanbanMockItem {
  nameKey: OrderItemKey;
  customName?: string;
  quantity: number;
  price: number;
  imageUrl?: string | null;
}
export interface OrderKanbanMockTicket {
  backendOrderId?: number;
  createdAt: string;
  orderNumber: string;
  time: string;
  orderTypeKey: OrderTypeKey;
  tableNumber?: number;
  subtotal?: number | undefined;
  discountAmount?: number | undefined;
  taxAmount?: number | undefined;
  promotionLabel?: string | undefined;
  total: number;
  items: OrderKanbanMockItem[];
}
export interface OrderKanbanMockColumn {
  key: KanbanStatus;
  orders: OrderKanbanMockTicket[];
}

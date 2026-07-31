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
  quantity: number;
  price: number;
  imageUrl?: string | null;
}
export interface OrderKanbanMockTicket {
  createdAt: string;
  orderNumber: string;
  time: string;
  orderTypeKey: OrderTypeKey;
  tableNumber?: number;
  total: number;
  items: OrderKanbanMockItem[];
}
export interface OrderKanbanMockColumn {
  key: KanbanStatus;
  orders: OrderKanbanMockTicket[];
}

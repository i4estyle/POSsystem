import type { ProductInterface } from './product';

export enum OrderChannel {
  POS = 'pos',
  QR_ORDER = 'qr_order',
}

export enum OrderType {
  DINE_IN = 'dine_in',
  TAKEAWAY = 'takeaway',
  DELIVERY = 'delivery',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  SERVED = 'served',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH = 'cash',
  QR = 'qr',
  CREDIT_CARD = 'credit',
  TRUE_WALLET = 'truemoney',
}

export interface CreateOrderItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
  discount?: number | undefined;
  note?: string | undefined;
}

export interface CreateOrderDto {
  branchId: number;
  customerId?: number | undefined;
  employeeId?: number | undefined;
  tableId?: number | undefined;
  promotionId?: number | undefined;
  orderChannel?: OrderChannel | undefined;
  orderType?: OrderType | undefined;
  guestName?: string | undefined;
  guestPhone?: string | undefined;
  discountAmount?: number | undefined;
  taxAmount?: number | undefined;
  items: CreateOrderItemDto[];
}

export interface CartItemInterface {
  product: ProductInterface;
  quantity: number;
  note?: string;
}

export interface OrderInterface {
  orderId: number;
  orderNumber: string;
  branchId: number;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  netAmount: number;
  status: OrderStatus;
  orderType: OrderType;
  orderChannel: OrderChannel;
  orderDate: string;
}

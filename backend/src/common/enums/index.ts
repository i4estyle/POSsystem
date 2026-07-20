export enum BranchStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum RoleName {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CASHIER = 'cashier',
  KITCHEN = 'kitchen',
}

export enum EmployeeStatus {
  ACTIVE = 'active',
  RESIGNED = 'resigned',
  SUSPENDED = 'suspended',
}

export enum AttendanceStatus {
  ON_TIME = 'on_time',
  LATE = 'late',
  ABSENT = 'absent',
  LEAVE = 'leave',
}

export enum SalaryStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

export enum MemberLevel {
  REGULAR = 'regular',
  SILVER = 'silver',
  GOLD = 'gold',
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum MovementType {
  IN = 'in',
  OUT = 'out',
  ADJUST = 'adjust',
}

export enum ReferenceType {
  ORDER = 'order',
  PURCHASE_ORDER = 'purchase_order',
  MANUAL = 'manual',
}

export enum PurchaseOrderStatus {
  PENDING = 'pending',
  RECEIVED = 'received',
  CANCELLED = 'cancelled',
}

export enum PromotionType {
  PERCENT = 'percent',
  FIXED_AMOUNT = 'fixed_amount',
  BUY_X_GET_Y = 'buy_x_get_y',
}

export enum PromotionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  DISABLED = 'disabled',
}

export enum DiningTableStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
}

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

export enum OrderItemStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  SERVED = 'served',
}

export enum PaymentMethodStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum PaymentStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum QrType {
  DINE_IN = 'dine_in',
  TAKEAWAY = 'takeaway',
}

export enum QrCodeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum SessionStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export enum RequestType {
  CALL_STAFF = 'call_staff',
  REQUEST_BILL = 'request_bill',
  REQUEST_WATER = 'request_water',
  OTHER = 'other',
}

export enum RequestStatus {
  PENDING = 'pending',
  ACKNOWLEDGED = 'acknowledged',
  DONE = 'done',
}

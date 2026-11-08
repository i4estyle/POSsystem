import type { ProductInterface } from './product';
import type { PromotionItem } from '@/stores/promotion-store';

export type TableRoundStatus = 'sent' | 'preparing' | 'ready' | 'served';
export type MobileOrderTab = 'menu' | 'cart' | 'status' | 'service';

export interface MobileAddonOption {
  id: string;
  labelTh: string;
  labelEn: string;
  price: number;
}

export interface MobileCartCustomization {
  sweetness?: string;
  spiciness?: string;
  addons: MobileAddonOption[];
  excludedTags: string[];
  note: string;
}

export interface MobileCartItem {
  cartItemId: string;
  product: ProductInterface;
  quantity: number;
  customization: MobileCartCustomization;
  unitTotal: number;
}

export interface TableOrderRound {
  roundId: string;
  backendOrderId?: number;
  roundNumber: number;
  orderNumber: string;
  createdAt: string;
  status: TableRoundStatus;
  items: MobileCartItem[];
  roundSubtotal: number;
  tableNote?: string;
}

export interface SelfServiceRequestItem {
  id: string;
  icon: string;
  titleTh: string;
  titleEn: string;
  quantity: number;
  note?: string;
  createdAt: string;
  status: 'pending' | 'delivering' | 'completed';
}

export interface TableBillSummary {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  perPersonAmount: number;
  appliedPromotion: PromotionItem | null;
}

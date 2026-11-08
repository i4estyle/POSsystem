import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useProductStore } from './product-store';
import { useOrderStore } from './order-store';
import type { PromotionItem } from './promotion-store';
import type { ProductInterface } from '@/types/product';
import { OrderChannel, OrderStatus, OrderType, type CreateOrderDto } from '@/types/order';
import { orderService, type BackendOrderDetail } from '@/services/order-service';
import { qrOrderService } from '@/services/qr-order-service';
import type {
  MobileAddonOption,
  MobileCartCustomization,
  MobileCartItem,
  SelfServiceRequestItem,
  TableBillSummary,
  TableOrderRound,
  TableRoundStatus,
} from '@/types/qr-order';

export const FOOD_ADDONS: MobileAddonOption[] = [
  { id: 'cheese', labelTh: 'เพิ่มชีสเชดดาร์', labelEn: 'Extra Cheddar Cheese', price: 25 },
  { id: 'bacon', labelTh: 'เพิ่มเบคอนกรอบ', labelEn: 'Crispy Bacon', price: 35 },
  { id: 'egg', labelTh: 'เพิ่มไข่ดาว', labelEn: 'Fried Egg', price: 15 },
  { id: 'truffle', labelTh: 'ซอสทรัฟเฟิลดิป', labelEn: 'Truffle Mayo Dip', price: 20 },
];

export const DRINK_ADDONS: MobileAddonOption[] = [
  { id: 'boba', labelTh: 'เพิ่มไข่มุกบราวน์ชูการ์', labelEn: 'Brown Sugar Boba', price: 15 },
  { id: 'whip', labelTh: 'เพิ่มวิปครีมสด', labelEn: 'Fresh Whipped Cream', price: 20 },
  { id: 'shot', labelTh: 'เพิ่มช็อตเอสเพรสโซ่', labelEn: 'Extra Espresso Shot', price: 25 },
  { id: 'oatmilk', labelTh: 'เปลี่ยนเป็นนมโอ๊ต', labelEn: 'Switch to Oat Milk', price: 20 },
];

export const SWEETNESS_OPTIONS = ['0%', '25%', '50%', '100% (ปกติ)', '125%'];
export const SPICINESS_OPTIONS = ['ไม่เผ็ด', 'เผ็ดน้อย', 'เผ็ดปกติ', 'เผ็ดมาก'];
export const FOOD_EXCLUDED_TAGS = ['ไม่ใส่ผัก', 'ไม่ใส่หอมใหญ่', 'ไม่ใส่มะเขือเทศ', 'แยกซอส'];
export const DRINK_EXCLUDED_TAGS = ['แยกน้ำแข็ง', 'น้ำแข็งน้อย', 'ไม่ใส่ไซรัป', 'ไม่โรยผง'];

const formatTimeNow = (): string => {
  const now = new Date();
  return now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
};

const mapBackendStatusToRoundStatus = (status: OrderStatus): TableRoundStatus => {
  if (status === OrderStatus.PREPARING) return 'preparing';
  if (status === OrderStatus.READY) return 'ready';
  if (status === OrderStatus.SERVED || status === OrderStatus.PAID) return 'served';
  return 'sent';
};

export const useQrOrderStore = defineStore('qr-order', () => {
  const productStore = useProductStore();
  const orderStore = useOrderStore();

  const tableId = ref<number>(1);
  const tableNumber = ref<string>('T-01');
  const activeSessionId = ref<number>(1);
  const activeQrToken = ref<string>('');
  const guestCount = ref<number>(2);
  const diningMode = ref<'dine_in' | 'takeaway'>('dine_in');
  const sessionStartedAt = ref<string>(formatTimeNow());

  const cartItems = ref<MobileCartItem[]>([]);
  const appliedPromotion = ref<PromotionItem | null>(null);
  const currentTableNote = ref<string>('');

  // Starts clean with no mockup orders; populated from real orders for this tableId
  const orderRounds = ref<TableOrderRound[]>([]);
  const serviceRequests = ref<SelfServiceRequestItem[]>([]);

  const cartItemCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0),
  );

  const cartSubtotal = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.unitTotal * item.quantity, 0),
  );

  const totalOrderedItemsCount = computed(() =>
    orderRounds.value.reduce(
      (sum, round) => sum + round.items.reduce((rSum, item) => rSum + item.quantity, 0),
      0,
    ),
  );

  const activeKitchenRoundsCount = computed(
    () => orderRounds.value.filter((r) => r.status !== 'served').length,
  );

  const billSummary = computed<TableBillSummary>(() => {
    const subtotal = orderRounds.value.reduce((sum, r) => sum + r.roundSubtotal, 0);
    let discountAmount = 0;
    const promo = appliedPromotion.value;

    if (promo && subtotal >= promo.minOrderAmount) {
      if (promo.discountType === 'percentage') {
        discountAmount = Number(((subtotal * promo.discountValue) / 100).toFixed(2));
      } else {
        discountAmount = Math.min(subtotal, promo.discountValue);
      }
    }

    const taxable = Math.max(0, subtotal - discountAmount);
    const taxAmount = Number((taxable * 0.07).toFixed(2));
    const grandTotal = Number((taxable + taxAmount).toFixed(2));
    const guests = Math.max(1, guestCount.value);
    const perPersonAmount = Number((grandTotal / guests).toFixed(2));

    return {
      subtotal,
      discountAmount,
      taxAmount,
      grandTotal,
      perPersonAmount,
      appliedPromotion: promo,
    };
  });

  const getProductCartQty = (productId: number): number => {
    return cartItems.value
      .filter((item) => item.product.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const mapBackendOrderToRound = (bo: BackendOrderDetail, roundIdx: number): TableOrderRound => {
    const d = bo.orderDate ? new Date(bo.orderDate) : new Date();
    const createdAt = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    const items: MobileCartItem[] = (bo.items ?? []).map((it) => {
      const matchedProduct = productStore.products.find((p) => p.productId === it.productId) ?? {
        productId: it.productId,
        categoryId: 1,
        productName: it.product?.productName || `เมนู #${it.productId}`,
        sku: `SKU-${it.productId}`,
        costPrice: 0,
        sellingPrice: Number(it.unitPrice),
        unit: 'รายการ',
        status: 'active' as const,
        imageUrl: it.product?.imageUrl ?? null,
      };

      return {
        cartItemId: `db-item-${it.orderItemId}`,
        product: matchedProduct,
        quantity: Number(it.quantity),
        unitTotal: Number(it.unitPrice),
        customization: {
          addons: [],
          excludedTags: [],
          note: it.note ?? '',
        },
      };
    });

    const roundSubtotal = items.reduce((sum, i) => sum + i.unitTotal * i.quantity, 0);

    return {
      roundId: `db-round-${bo.orderId}`,
      backendOrderId: bo.orderId,
      roundNumber: roundIdx,
      orderNumber: bo.orderNumber,
      createdAt,
      status: mapBackendStatusToRoundStatus(bo.status),
      items,
      roundSubtotal: roundSubtotal || Number(bo.totalAmount || 0),
    };
  };

  const syncRoundsStatusFromBackend = async (): Promise<void> => {
    try {
      let tableOrders: BackendOrderDetail[] = [];

      if (activeQrToken.value) {
        tableOrders = await qrOrderService.getPublicOrders(
          activeQrToken.value,
          activeSessionId.value || undefined,
          tableId.value || undefined,
        );
      } else {
        const liveOrders = await orderService.findAll(50);
        tableOrders = liveOrders.filter((bo) => Number(bo.tableId) === Number(tableId.value));
      }

      tableOrders.sort((a, b) => a.orderId - b.orderId);

      const syncedRounds: TableOrderRound[] = tableOrders.map((bo, idx) => {
        const existing = orderRounds.value.find(
          (r) => r.backendOrderId === bo.orderId || r.orderNumber === bo.orderNumber,
        );
        if (existing) {
          existing.status = mapBackendStatusToRoundStatus(bo.status);
          existing.roundNumber = idx + 1;
          if (existing.items.length === 0 && bo.items && bo.items.length > 0) {
            existing.items = mapBackendOrderToRound(bo, idx + 1).items;
          }
          return existing;
        }
        return mapBackendOrderToRound(bo, idx + 1);
      });

      const unsyncedLocal = orderRounds.value.filter((r) => !r.backendOrderId);
      orderRounds.value = [...[...syncedRounds].reverse(), ...unsyncedLocal];
    } catch {
      // Offline / fallback mode
    }
  };

  const initTableSession = (token: string, id?: number, numberStr?: string): void => {
    activeQrToken.value = token;
    const nextId = id && !Number.isNaN(id) ? id : 1;
    const isTableChanged = tableId.value !== nextId;
    tableId.value = nextId;

    if (numberStr && numberStr.trim()) {
      tableNumber.value = numberStr.trim();
    } else {
      tableNumber.value = `T-${nextId < 10 ? '0' + nextId : nextId}`;
    }

    if (isTableChanged) {
      orderRounds.value = [];
      cartItems.value = [];
      serviceRequests.value = [];
    }

    void syncRoundsStatusFromBackend();

    void qrOrderService
      .createSession(activeQrToken.value, guestCount.value)
      .then((res) => {
        if (res?.sessionId) {
          activeSessionId.value = res.sessionId;
        }
      })
      .catch(() => {
        // Offline / fallback mode
      });
  };

  const setGuestCount = (delta: number): void => {
    const next = guestCount.value + delta;
    if (next >= 1 && next <= 20) {
      guestCount.value = next;
    }
  };

  const addCustomizedItemToCart = (
    product: ProductInterface,
    quantity: number,
    customization: MobileCartCustomization,
  ): void => {
    const addonsSum = customization.addons.reduce((sum, a) => sum + a.price, 0);
    const unitTotal = product.sellingPrice + addonsSum;

    const signature = JSON.stringify({
      productId: product.productId,
      sweetness: customization.sweetness || '',
      spiciness: customization.spiciness || '',
      addons: customization.addons.map((a) => a.id).sort(),
      excludedTags: [...customization.excludedTags].sort(),
      note: customization.note.trim(),
    });

    const existing = cartItems.value.find((item) => {
      const existingSig = JSON.stringify({
        productId: item.product.productId,
        sweetness: item.customization.sweetness || '',
        spiciness: item.customization.spiciness || '',
        addons: item.customization.addons.map((a) => a.id).sort(),
        excludedTags: [...item.customization.excludedTags].sort(),
        note: item.customization.note.trim(),
      });
      return existingSig === signature;
    });

    if (existing) {
      existing.quantity += quantity;
    } else {
      cartItems.value.push({
        cartItemId: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        product,
        quantity,
        customization: {
          ...customization,
          addons: [...customization.addons],
          excludedTags: [...customization.excludedTags],
          note: customization.note.trim(),
        },
        unitTotal,
      });
    }
  };

  const updateCartItemQty = (cartItemId: string, delta: number): void => {
    const idx = cartItems.value.findIndex((i) => i.cartItemId === cartItemId);
    if (idx === -1) return;
    const item = cartItems.value[idx];
    if (!item) return;

    const nextQty = item.quantity + delta;
    if (nextQty <= 0) {
      cartItems.value.splice(idx, 1);
    } else {
      item.quantity = nextQty;
    }
  };

  const removeCartItem = (cartItemId: string): void => {
    cartItems.value = cartItems.value.filter((i) => i.cartItemId !== cartItemId);
  };

  const clearCart = (): void => {
    cartItems.value = [];
    currentTableNote.value = '';
  };

  const submitRoundToKitchen = async (): Promise<TableOrderRound | null> => {
    if (cartItems.value.length === 0) return null;

    const nextRoundNumber = orderRounds.value.length + 1;
    const orderNumber = `QR-${Date.now().toString().slice(-4)}`;
    const roundSubtotal = cartSubtotal.value;

    const newRound: TableOrderRound = {
      roundId: `round-${Date.now()}`,
      roundNumber: nextRoundNumber,
      orderNumber,
      createdAt: formatTimeNow(),
      status: 'sent',
      items: cartItems.value.map((i) => ({ ...i })),
      roundSubtotal,
      ...(currentTableNote.value.trim() ? { tableNote: currentTableNote.value.trim() } : {}),
    };

    let roundDiscount = 0;
    const promo = appliedPromotion.value;
    if (promo && roundSubtotal >= promo.minOrderAmount) {
      if (promo.discountType === 'percentage') {
        roundDiscount = Number(((roundSubtotal * promo.discountValue) / 100).toFixed(2));
      } else {
        roundDiscount = Math.min(roundSubtotal, promo.discountValue);
      }
    }
    const roundTaxable = Math.max(0, roundSubtotal - roundDiscount);
    const roundTax = Number((roundTaxable * 0.07).toFixed(2));
    const roundNetTotal = Number((roundTaxable + roundTax).toFixed(2));
    const promoLabel =
      promo && roundDiscount > 0
        ? promo.discountType === 'percentage'
          ? `${promo.code} (-${promo.discountValue}%)`
          : `${promo.code} (-฿${promo.discountValue})`
        : undefined;

    const dto: CreateOrderDto = {
      tableId: tableId.value,
      promotionId: promo && roundDiscount > 0 ? promo.id : undefined,
      orderChannel: OrderChannel.QR_ORDER,
      orderType: diningMode.value === 'dine_in' ? OrderType.DINE_IN : OrderType.TAKEAWAY,
      items: cartItems.value.map((item) => {
        const details: string[] = [];
        if (item.customization.sweetness) details.push(`หวาน ${item.customization.sweetness}`);
        if (item.customization.spiciness) details.push(item.customization.spiciness);
        if (item.customization.addons.length) {
          details.push(item.customization.addons.map((a) => `+${a.labelTh}`).join(', '));
        }
        if (item.customization.excludedTags.length) {
          details.push(item.customization.excludedTags.join(', '));
        }
        if (item.customization.note) {
          details.push(item.customization.note);
        }

        const resultItem: {
          productId: number;
          quantity: number;
          note?: string;
        } = {
          productId: item.product.productId,
          quantity: item.quantity,
        };
        if (details.length > 0) {
          resultItem.note = details.join(' | ');
        }
        return resultItem;
      }),
    };

    try {
      const created = await qrOrderService.createOrder(
        activeQrToken.value,
        activeSessionId.value,
        dto,
      );
      if (created?.orderId) {
        newRound.backendOrderId = created.orderId;
        newRound.orderNumber = created.orderNumber;
      }
    } catch {
      // Fallback for offline/demo mode
    }

    orderStore.addLiveTicketLocally({
      ...(newRound.backendOrderId ? { backendOrderId: newRound.backendOrderId } : {}),
      orderNumber: newRound.orderNumber,
      tableId: tableId.value,
      isTakeaway: diningMode.value === 'takeaway',
      orderChannel: 'qr_order',
      subtotal: roundSubtotal,
      discountAmount: roundDiscount,
      taxAmount: roundTax,
      ...(promoLabel ? { promotionLabel: promoLabel } : {}),
      total: roundNetTotal,
      items: cartItems.value.map((item) => {
        const mods: string[] = [];
        if (item.customization.sweetness) mods.push(`หวาน ${item.customization.sweetness}`);
        if (item.customization.spiciness) mods.push(item.customization.spiciness);
        if (item.customization.addons.length) {
          mods.push(item.customization.addons.map((a) => `+${a.labelTh}`).join(', '));
        }
        return {
          name: mods.length
            ? `${item.product.productName} (${mods.join(', ')})`
            : item.product.productName,
          quantity: item.quantity,
          price: item.unitTotal,
          imageUrl: item.product.imageUrl ?? null,
        };
      }),
    });

    cartItems.value.forEach((item) => {
      productStore.deductStock(item.product.productId, item.quantity);
    });

    orderRounds.value.unshift(newRound);
    clearCart();
    return newRound;
  };

  const sendSelfServiceRequest = (payload: {
    icon: string;
    titleTh: string;
    titleEn: string;
    quantity: number;
    note?: string;
  }): SelfServiceRequestItem => {
    const item: SelfServiceRequestItem = {
      id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      icon: payload.icon,
      titleTh: payload.titleTh,
      titleEn: payload.titleEn,
      quantity: payload.quantity,
      ...(payload.note ? { note: payload.note } : {}),
      createdAt: formatTimeNow(),
      status: 'pending',
    };

    serviceRequests.value.unshift(item);

    const requestType = payload.icon === 'local_drink' ? 'request_water' : 'other';
    void qrOrderService
      .createTableRequest(activeQrToken.value, {
        sessionId: activeSessionId.value,
        requestType,
      })
      .catch(() => {
        // Offline / fallback mode
      });

    setTimeout(() => {
      const target = serviceRequests.value.find((r) => r.id === item.id);
      if (target && target.status === 'pending') {
        target.status = 'delivering';
      }
    }, 2500);

    return item;
  };

  const markServiceRequestCompleted = (id: string): void => {
    const target = serviceRequests.value.find((r) => r.id === id);
    if (target) {
      target.status = 'completed';
    }
  };

  return {
    tableId,
    tableNumber,
    guestCount,
    diningMode,
    sessionStartedAt,
    cartItems,
    appliedPromotion,
    currentTableNote,
    orderRounds,
    serviceRequests,
    cartItemCount,
    cartSubtotal,
    totalOrderedItemsCount,
    activeKitchenRoundsCount,
    billSummary,
    getProductCartQty,
    initTableSession,
    setGuestCount,
    addCustomizedItemToCart,
    updateCartItemQty,
    removeCartItem,
    clearCart,
    submitRoundToKitchen,
    syncRoundsStatusFromBackend,
    sendSelfServiceRequest,
    markServiceRequestCompleted,
  };
});

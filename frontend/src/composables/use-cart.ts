import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { orderService } from '@/services/order-service';
import { useProductStore } from '@/stores/product-store';
import type { PromotionItem } from '@/stores/promotion-store';
import type { MemberItem } from '@/stores/member-store';
import {
  OrderType,
  OrderChannel,
  PaymentMethod,
  type CartItemInterface,
  type CreateOrderDto,
} from '@/types/order';
import type { ProductInterface } from '@/types/product';

export function useCart() {
  const $q = useQuasar();
  const { t } = useI18n();
  const productStore = useProductStore();

  const cartItems = ref<CartItemInterface[]>([
    {
      product: {
        productId: 1,
        categoryId: 1,
        productName: 'Double Cheese Burger',
        sku: 'SKU-001',
        costPrice: 100,
        sellingPrice: 189.0,
        unit: 'ชิ้น',
        status: 'active',
        isPopular: true,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
      },
      quantity: 1,
    },
    {
      product: {
        productId: 2,
        categoryId: 2,
        productName: 'Iced Matcha Latte',
        sku: 'SKU-002',
        costPrice: 40,
        sellingPrice: 85.0,
        unit: 'แก้ว',
        status: 'active',
        isPopular: true,
        imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80',
      },
      quantity: 2,
    },
  ]);

  const orderType = ref<OrderType>(OrderType.DINE_IN);
  const selectedTableId = ref<number | null>(null);
  const selectedPromotion = ref<PromotionItem | null>(null);
  const selectedMember = ref<MemberItem | null>(null);
  const paymentMethod = ref<PaymentMethod>(PaymentMethod.CASH);
  const tenderedAmount = ref<number>(0);
  const isSubmitting = ref<boolean>(false);
  const error = ref<string | null>(null);

  const itemCount = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  const subtotal = computed(() => {
    return cartItems.value.reduce(
      (sum, item) => sum + item.product.sellingPrice * item.quantity,
      0,
    );
  });

  const discountAmount = computed(() => {
    if (!selectedPromotion.value) return 0;
    const promo = selectedPromotion.value;
    if (subtotal.value < promo.minOrderAmount) return 0;
    if (promo.discountType === 'percentage') {
      return Number(((subtotal.value * promo.discountValue) / 100).toFixed(2));
    }
    return Math.min(subtotal.value, promo.discountValue);
  });

  const tax = computed(() => {
    const taxableSubtotal = Math.max(0, subtotal.value - discountAmount.value);
    return Number((taxableSubtotal * 0.07).toFixed(2));
  });

  const total = computed(() => {
    return Number(Math.max(0, subtotal.value - discountAmount.value + tax.value).toFixed(2));
  });

  const changeAmount = computed(() => {
    if (paymentMethod.value !== PaymentMethod.CASH) return 0;
    return Number(Math.max(0, tenderedAmount.value - total.value).toFixed(2));
  });

  const addToCart = (product: ProductInterface): void => {
    if (product.stockQuantity === 0) {
      $q.notify({
        type: 'warning',
        message: t('pos.outOfStock', { name: product.productName }),
        position: 'top',
      });
      return;
    }
    const existing = cartItems.value.find((item) => item.product.productId === product.productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.value.push({ product, quantity: 1 });
    }
  };

  const updateQuantity = (productId: number, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = cartItems.value.find((i) => i.product.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
  };

  const removeFromCart = (productId: number): void => {
    cartItems.value = cartItems.value.filter((i) => i.product.productId !== productId);
  };

  const clearCart = (): void => {
    cartItems.value = [];
    selectedPromotion.value = null;
    selectedMember.value = null;
    tenderedAmount.value = 0;
  };

  const applyPromotion = (promotion: PromotionItem): void => {
    selectedPromotion.value = promotion;
  };

  const removePromotion = (): void => {
    selectedPromotion.value = null;
  };

  const selectMember = (member: MemberItem): void => {
    selectedMember.value = member;
  };

  const removeMember = (): void => {
    selectedMember.value = null;
  };

  const submitOrder = async (): Promise<boolean> => {
    if (cartItems.value.length === 0) return false;

    isSubmitting.value = true;
    error.value = null;

    const dto: CreateOrderDto = {
      branchId: 1,
      orderChannel: OrderChannel.POS,
      orderType: orderType.value,
      tableId: selectedTableId.value ?? undefined,
      promotionId: selectedPromotion.value?.id ?? undefined,
      customerId: selectedMember.value?.id ?? undefined,
      taxAmount: tax.value,
      discountAmount: discountAmount.value,
      items: cartItems.value.map((item) => {
        const itemDto: {
          productId: number;
          quantity: number;
          unitPrice: number;
          note?: string;
        } = {
          productId: item.product.productId,
          quantity: item.quantity,
          unitPrice: item.product.sellingPrice,
        };
        if (item.note) {
          itemDto.note = item.note;
        }
        return itemDto;
      }),
    };

    try {
      cartItems.value.forEach((i) => {
        productStore.deductStock(i.product.productId, i.quantity);
      });
      await orderService.create(dto);
      clearCart();
      return true;
    } catch {
      cartItems.value.forEach((i) => {
        productStore.deductStock(i.product.productId, i.quantity);
      });
      clearCart();
      return true;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    cartItems,
    orderType,
    selectedTableId,
    selectedPromotion,
    selectedMember,
    paymentMethod,
    tenderedAmount,
    isSubmitting,
    error,
    itemCount,
    subtotal,
    discountAmount,
    tax,
    total,
    changeAmount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromotion,
    removePromotion,
    selectMember,
    removeMember,
    submitOrder,
  };
}

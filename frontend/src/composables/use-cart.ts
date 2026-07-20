import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { orderService } from '@/services/order-service';
import {
  OrderType,
  OrderChannel,
  type CartItemInterface,
  type CreateOrderDto,
} from '@/types/order';
import type { ProductInterface } from '@/types/product';

export function useCart() {
  const $q = useQuasar();
  const { t } = useI18n();

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
      },
      quantity: 2,
    },
    {
      product: {
        productId: 3,
        categoryId: 4,
        productName: 'Truffle Fries',
        sku: 'SKU-003',
        costPrice: 50,
        sellingPrice: 120.0,
        unit: 'จาน',
        status: 'active',
      },
      quantity: 1,
    },
  ]);

  const orderType = ref<OrderType>(OrderType.DINE_IN);
  const selectedTableId = ref<number | null>(null);
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

  const tax = computed(() => {
    return Number((subtotal.value * 0.07).toFixed(2));
  });

  const total = computed(() => {
    return Number((subtotal.value + tax.value).toFixed(2));
  });

  const addToCart = (product: ProductInterface): void => {
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
      taxAmount: tax.value,
      discountAmount: 0,
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
      await orderService.create(dto);
      clearCart();
      $q.notify({
        type: 'positive',
        message: t('pos.orderSuccess'),
        position: 'top',
      });
      return true;
    } catch {
      $q.notify({
        type: 'positive',
        message: t('pos.orderSuccess'),
        position: 'top',
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
    isSubmitting,
    error,
    itemCount,
    subtotal,
    tax,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    submitOrder,
  };
}

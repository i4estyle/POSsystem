<template>
  <aside class="cart-section">
    <CartHeader :count="itemCount" />

    <CartOrderControls
      ref="controlsRef"
      :order-type="orderType"
      :selected-table-id="selectedTableId"
      :tables="tables || []"
      @update:order-type="$emit('update:orderType', $event)"
      @update:selected-table-id="$emit('update:selectedTableId', $event)"
    />

    <CartItemList :items="items" @update-qty="(pId, qty) => $emit('update-qty', pId, qty)" />

    <CartSummary
      :subtotal="subtotal"
      :discount="discountAmount"
      :tax="tax"
      :total="total"
      :disabled="items.length === 0"
      :is-submitting="isSubmitting"
      :selected-promotion="selectedPromotion"
      :selected-member="selectedMember"
      @open-promotion-dialog="$emit('open-promotion-dialog')"
      @open-member-dialog="$emit('open-member-dialog')"
      @remove-promotion="$emit('remove-promotion')"
      @remove-member="$emit('remove-member')"
      @confirm="$emit('confirm')"
    />
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CartHeader from './cart-header.vue';
import CartOrderControls from './cart-order-controls.vue';
import CartItemList from './cart-item-list.vue';
import CartSummary from './cart-summary.vue';
import type { CartItemInterface, OrderType } from '@/types/order';
import type { TableManagementItem } from '@/types/dining-table';
import type { PromotionItem } from '@/stores/promotion-store';
import type { MemberItem } from '@/stores/member-store';

const controlsRef = ref<InstanceType<typeof CartOrderControls> | null>(null);

const focusTableSelect = (): void => {
  controlsRef.value?.focusTableSelect();
};

defineExpose({
  focusTableSelect,
});

withDefaults(
  defineProps<{
    items: CartItemInterface[];
    itemCount: number;
    subtotal: number;
    discountAmount?: number;
    tax: number;
    total: number;
    orderType: OrderType;
    selectedTableId: number | null;
    tables?: TableManagementItem[];
    selectedPromotion?: PromotionItem | null;
    selectedMember?: MemberItem | null;
    isSubmitting?: boolean;
  }>(),
  {
    discountAmount: 0,
    tables: () => [],
    selectedPromotion: null,
    selectedMember: null,
    isSubmitting: false,
  },
);

defineEmits<{
  (e: 'update:orderType', value: OrderType): void;
  (e: 'update:selectedTableId', value: number | null): void;
  (e: 'update-qty', productId: number, quantity: number): void;
  (e: 'open-promotion-dialog'): void;
  (e: 'open-member-dialog'): void;
  (e: 'remove-promotion'): void;
  (e: 'remove-member'): void;
  (e: 'confirm'): void;
}>();
</script>

<style lang="scss" scoped>
// Cart panel layout styling handled by pos-sales.scss and component scoped styles
</style>

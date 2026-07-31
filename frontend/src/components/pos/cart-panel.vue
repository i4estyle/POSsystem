<template>
  <aside class="cart-section">
    <CartHeader :count="itemCount" />

    <CartOrderControls
      :order-type="orderType"
      :selected-table-id="selectedTableId"
      :tables="tables"
      @update:order-type="$emit('update:orderType', $event)"
      @update:selected-table-id="$emit('update:selectedTableId', $event)"
    />

    <CartItemList :items="items" @update-qty="(pId, qty) => $emit('update-qty', pId, qty)" />

    <CartSummary
      :subtotal="subtotal"
      :tax="tax"
      :total="total"
      :disabled="items.length === 0"
      :is-submitting="isSubmitting"
      @confirm="$emit('confirm')"
    />
  </aside>
</template>

<script setup lang="ts">
import CartHeader from './cart-header.vue';
import CartOrderControls from './cart-order-controls.vue';
import CartItemList from './cart-item-list.vue';
import CartSummary from './cart-summary.vue';
import type { CartItemInterface, OrderType } from '@/types/order';
import type { TableManagementItem } from '@/types/dining-table';

defineProps<{
  items: CartItemInterface[];
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  orderType: OrderType;
  selectedTableId: number | null;
  tables: TableManagementItem[];
  isSubmitting?: boolean;
}>();

defineEmits<{
  (e: 'update:orderType', value: OrderType): void;
  (e: 'update:selectedTableId', value: number | null): void;
  (e: 'update-qty', productId: number, quantity: number): void;
  (e: 'confirm'): void;
}>();
</script>

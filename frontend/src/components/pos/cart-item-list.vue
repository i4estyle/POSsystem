<template>
  <section class="cart-items-list">
    <section v-if="items.length === 0" class="empty-cart-msg">
      <q-icon name="remove_shopping_cart" size="48px" />
      <span>{{ t('pos.emptyCart') }}</span>
    </section>

    <CartItem
      v-for="item in items"
      :key="item.product.productId"
      :item="item"
      @update-qty="(pId, qty) => $emit('update-qty', pId, qty)"
    />
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CartItem from './cart-item.vue';
import type { CartItemInterface } from '@/types/order';

const { t } = useI18n();

defineProps<{
  items: CartItemInterface[];
}>();

defineEmits<{
  (e: 'update-qty', productId: number, quantity: number): void;
}>();
</script>

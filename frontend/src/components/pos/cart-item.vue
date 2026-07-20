<template>
  <article class="cart-item-row">
    <header class="item-thumb">
      <img
        v-if="item.product.imageUrl"
        :src="item.product.imageUrl"
        :alt="item.product.productName"
      />
      <q-icon v-else name="fastfood" size="24px" color="grey" />
    </header>

    <section class="item-details">
      <span class="item-name">{{ item.product.productName }}</span>
      <span class="item-price">฿{{ formattedPrice }}</span>
    </section>

    <QuantityStepper
      :model-value="item.quantity"
      @update:model-value="$emit('update-qty', item.product.productId, $event)"
    />
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import QuantityStepper from '@/components/base/quantity-stepper.vue';
import type { CartItemInterface } from '@/types/order';

const props = defineProps<{
  item: CartItemInterface;
}>();

defineEmits<{
  (e: 'update-qty', productId: number, quantity: number): void;
}>();

const formattedPrice = computed(() => {
  return Number(props.item.product.sellingPrice).toFixed(2);
});
</script>

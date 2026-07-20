<template>
  <section class="products-grid">
    <ProductCard
      v-for="prod in products"
      :key="prod.productId"
      :product="prod"
      @add="$emit('add-to-cart', $event)"
    />
  </section>
</template>

<script setup lang="ts">
import ProductCard from './product-card.vue';
import type { ProductInterface } from '@/types/product';

defineProps<{
  products: ProductInterface[];
}>();

defineEmits<{
  (e: 'add-to-cart', product: ProductInterface): void;
}>();
</script>

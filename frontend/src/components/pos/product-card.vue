<template>
  <article class="product-card">
    <header class="product-img-box">
      <img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        :alt="product.productName"
        class="product-img"
      />
      <q-icon v-else name="restaurant" class="img-fallback-icon" />
    </header>

    <section class="product-info">
      <h3 class="product-name">{{ product.productName }}</h3>
      <footer class="product-footer">
        <span class="price">฿{{ formattedPrice }}</span>
        <button
          type="button"
          class="add-btn"
          aria-label="Add to cart"
          @click="$emit('add', product)"
        >
          <q-icon name="add" size="20px" />
        </button>
      </footer>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProductInterface } from '@/types/product';

const props = defineProps<{
  product: ProductInterface;
}>();

defineEmits<{
  (e: 'add', product: ProductInterface): void;
}>();

const formattedPrice = computed(() => {
  return Number(props.product.sellingPrice).toFixed(2);
});
</script>

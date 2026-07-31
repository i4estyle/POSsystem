<template>
  <article
    class="product-card"
    :class="{ 'is-out-of-stock': isOutOfStock, 'is-popular': product.isPopular }"
  >
    <header class="product-img-box">
      <img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        :alt="product.productName"
        class="product-img"
      />
      <q-icon v-else name="restaurant" class="img-fallback-icon" />

      <span v-if="product.isPopular" class="popular-star-badge" :title="t('pos.popular')">
        <q-icon name="star" size="14px" />
        <span class="badge-text">{{ t('pos.popular') }}</span>
      </span>

      <span v-if="hasStockInfo" class="stock-badge" :class="stockBadgeClass">
        {{ stockText }}
      </span>

      <div v-if="isOutOfStock" class="out-of-stock-overlay">
        <span>{{ t('pos.outOfStockBadge') }}</span>
      </div>
    </header>

    <section class="product-info">
      <h3 class="product-name">{{ product.productName }}</h3>
      <footer class="product-footer">
        <span class="price">฿{{ formattedPrice }}</span>
        <button
          type="button"
          class="add-btn"
          :disabled="isOutOfStock"
          aria-label="Add to cart"
          @click="onAdd"
        >
          <q-icon name="add" size="20px" />
        </button>
      </footer>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ProductInterface } from '@/types/product';

const { t } = useI18n();

const props = defineProps<{
  product: ProductInterface;
}>();

const emit = defineEmits<{
  (e: 'add', product: ProductInterface): void;
}>();

const formattedPrice = computed(() => {
  return Number(props.product.sellingPrice).toFixed(2);
});

const isOutOfStock = computed(() => {
  return props.product.stockQuantity === 0 || props.product.status === 'inactive';
});

const hasStockInfo = computed(() => {
  return props.product.stockQuantity !== undefined && props.product.stockQuantity !== null;
});

const stockBadgeClass = computed(() => {
  const qty = props.product.stockQuantity ?? 0;
  if (qty === 0) return 'stock-none';
  if (qty <= 5) return 'stock-low';
  return 'stock-normal';
});

const stockText = computed(() => {
  const qty = props.product.stockQuantity;
  if (qty === undefined || qty === null) return '-';
  if (qty === 0) return t('pos.stockZero');
  return `${qty} ${props.product.unit || t('pos.unit')}`;
});

const onAdd = (): void => {
  if (!isOutOfStock.value) {
    emit('add', props.product);
  }
};
</script>

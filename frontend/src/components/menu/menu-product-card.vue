<template>
  <article class="menu-product-card">
    <div class="menu-product-image" :class="product.imageClass">
      <div class="product-actions">
        <button type="button" aria-label="Edit product" title="แก้ไขเมนู">
          <q-icon name="edit" size="18px" />
        </button>
        <button type="button" aria-label="More product options" title="ตัวเลือกเพิ่มเติม">
          <q-icon name="more_horiz" size="20px" />
        </button>
      </div>
      <span class="product-category">{{ product.category }}</span>
    </div>
    <div class="menu-product-details">
      <div class="product-name-row">
        <h3>{{ product.name }}</h3>
        <strong class="price-tag">฿{{ product.price }}</strong>
      </div>
      <p class="description">{{ product.description }}</p>
      <footer>
        <span class="stock-badge">
          <q-icon name="inventory_2" size="16px" />
          <span>{{ t('stock.inStockCount', { count: product.stock }) }}</span>
        </span>
        <span class="status-pill">{{ product.status }}</span>
      </footer>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

export interface MenuProduct {
  name: string;
  price: number;
  description: string;
  category: string;
  categoryId?: string;
  stock: number;
  status: string;
  imageClass: string;
}

defineProps<{ product: MenuProduct }>();
</script>

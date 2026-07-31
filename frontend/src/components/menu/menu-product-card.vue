<template>
  <article
    class="menu-product-card"
    :class="[{ inactive: product.status === 'inactive' }, stockClass]"
  >
    <!-- Image section -->
    <div class="mpc-image-wrap">
      <img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        :alt="product.productName"
        class="mpc-img"
      />
      <div v-else class="mpc-placeholder">
        <q-icon name="restaurant" size="40px" />
      </div>

      <!-- gradient overlay bottom -->
      <div class="mpc-img-gradient" />

      <!-- category chip (bottom-left of image) -->
      <span class="mpc-category-chip">
        <q-icon :name="categoryIcon" size="12px" />
        {{ categoryName }}
      </span>

      <!-- action buttons (top-right) -->
      <div class="mpc-actions">
        <button
          type="button"
          class="mpc-action-btn"
          aria-label="Edit product"
          title="แก้ไข"
          @click="emit('edit', product)"
        >
          <q-icon name="edit" size="16px" />
        </button>
        <button
          type="button"
          class="mpc-action-btn btn-del"
          aria-label="Delete product"
          title="ลบ"
          @click="emit('delete', product.productId)"
        >
          <q-icon name="delete" size="16px" />
        </button>
      </div>

      <!-- stock badge (top-left of image) -->
      <div class="mpc-stock-badge" :class="stockBadgeClass">
        <q-icon name="inventory_2" size="13px" />
        <span>{{ stockLabel }}</span>
      </div>
    </div>

    <!-- Details section -->
    <div class="mpc-details">
      <div class="mpc-name-row">
        <h3 class="mpc-name">{{ product.productName }}</h3>
      </div>

      <div class="mpc-meta">
        <span class="mpc-sku">{{ product.sku }}</span>
        <span class="mpc-unit">{{ product.unit }}</span>
      </div>

      <div class="mpc-footer">
        <div class="mpc-price-block">
          <span class="mpc-price">฿{{ product.sellingPrice.toLocaleString() }}</span>
          <span class="mpc-cost">ต้นทุน ฿{{ product.costPrice }}</span>
        </div>
        <button
          type="button"
          :class="['mpc-status-pill', product.status]"
          @click="emit('toggleStatus', product.productId)"
        >
          <span class="mpc-status-dot" />
          {{ product.status === 'active' ? t('common.active') : t('common.inactive') }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ProductInterface, CategoryInterface } from '@/types/product';

const { t } = useI18n();

const props = defineProps<{
  product: ProductInterface;
  categories: CategoryInterface[];
}>();

const emit = defineEmits<{
  (e: 'edit', product: ProductInterface): void;
  (e: 'delete', productId: number): void;
  (e: 'toggleStatus', productId: number): void;
}>();

const categoryName = computed((): string => {
  const match = props.categories.find((c) => c.categoryId === props.product.categoryId);
  return match ? match.categoryName : 'ทั่วไป';
});

const categoryIcon = computed((): string => {
  const name = categoryName.value;
  if (name.includes('เบอร์เกอร์')) return 'lunch_dining';
  if (name.includes('เครื่องดื่ม')) return 'local_cafe';
  if (name.includes('ของหวาน')) return 'cake';
  if (name.includes('ของว่าง')) return 'fastfood';
  if (name.includes('เซต')) return 'set_meal';
  return 'restaurant';
});

const stockClass = computed((): string => {
  const qty = props.product.stockQuantity;
  if (qty == null) return '';
  if (qty === 0) return 'stock-out';
  if (qty <= 5) return 'stock-low';
  return '';
});

const stockBadgeClass = computed((): string => {
  const qty = props.product.stockQuantity;
  if (qty == null) return 'badge-default';
  if (qty === 0) return 'badge-out';
  if (qty <= 5) return 'badge-low';
  if (qty <= 15) return 'badge-medium';
  return 'badge-ok';
});

const stockLabel = computed((): string => {
  const qty = props.product.stockQuantity;
  if (qty == null) return '—';
  if (qty === 0) return 'หมด';
  return `${qty} คงเหลือ`;
});
</script>

<style lang="scss">
@use '../../css/variables' as *;

.menu-product-card {
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(208, 195, 241, 0.35);
  box-shadow:
    0 2px 8px rgba(99, 88, 128, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.22s ease;
  cursor: default;

  &:hover {
    transform: translateY(-5px) scale(1.01);
    box-shadow:
      0 16px 40px rgba(99, 88, 128, 0.18),
      0 4px 12px rgba(0, 0, 0, 0.08);

    .mpc-actions {
      opacity: 1;
      transform: translateY(0);
    }

    .mpc-img {
      transform: scale(1.06);
    }
  }

  &.inactive {
    opacity: 0.6;
    filter: grayscale(0.5);
  }

  &.stock-low {
    border-color: rgba(234, 179, 8, 0.4);
  }

  &.stock-out {
    border-color: rgba(239, 68, 68, 0.35);
  }

  // ─── Image wrap ────────────────────────────────────────────────
  .mpc-image-wrap {
    position: relative;
    width: 100%;
    height: 190px;
    overflow: hidden;
    background: #f0eff4;
    flex-shrink: 0;
  }

  .mpc-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .mpc-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-primary;
    background: linear-gradient(135deg, #f5f0ff 0%, #ede9f6 100%);
  }

  .mpc-img-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70%;
    background: linear-gradient(to top, rgba(15, 10, 30, 0.65) 0%, transparent 100%);
    pointer-events: none;
  }

  // ─── Category chip ────────────────────────────────────────────
  .mpc-category-chip {
    position: absolute;
    bottom: 10px;
    left: 10px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #ffffff;
    font: 700 11px/1 $font-family-base;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  // ─── Stock badge ──────────────────────────────────────────────
  .mpc-stock-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 9px;
    border-radius: 999px;
    font: 700 11px/1 $font-family-base;
    white-space: nowrap;

    &.badge-ok {
      background: rgba(22, 163, 74, 0.92);
      color: #fff;
    }

    &.badge-medium {
      background: rgba(234, 179, 8, 0.9);
      color: #1a1000;
    }

    &.badge-low {
      background: rgba(234, 88, 12, 0.92);
      color: #fff;
      animation: pulse-badge 2s ease-in-out infinite;
    }

    &.badge-out {
      background: rgba(220, 38, 38, 0.92);
      color: #fff;
    }

    &.badge-default {
      background: rgba(107, 114, 128, 0.75);
      color: #fff;
    }
  }

  // ─── Action buttons ───────────────────────────────────────────
  .mpc-actions {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 6px;
    opacity: 0;
    transform: translateY(-4px);
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  .mpc-action-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(8px);
    color: $color-primary-dark;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
    transition:
      background 0.15s ease,
      transform 0.15s ease;

    &:hover {
      background: #ffffff;
      transform: scale(1.1);
    }

    &.btn-del {
      color: #dc2626;

      &:hover {
        background: #fef2f2;
      }
    }
  }

  // ─── Details section ──────────────────────────────────────────
  .mpc-details {
    padding: 14px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .mpc-name-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .mpc-name {
    margin: 0;
    font: 700 14px/1.4 $font-family-base;
    color: $color-text-main;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }

  .mpc-meta {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mpc-sku {
    font: 500 11px $font-family-base;
    color: $color-text-muted;
    background: rgba(99, 88, 128, 0.07);
    padding: 2px 7px;
    border-radius: 999px;
  }

  .mpc-unit {
    font: 600 11px $font-family-base;
    color: $color-text-body;
  }

  .mpc-footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 8px;
    margin-top: auto;
    padding-top: 4px;
    border-top: 1px solid rgba(208, 195, 241, 0.25);
  }

  .mpc-price-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .mpc-price {
    font: 800 18px/1 $font-family-base;
    color: $color-primary-dark;
    letter-spacing: -0.02em;
  }

  .mpc-cost {
    font: 500 10.5px $font-family-base;
    color: $color-text-muted;
  }

  .mpc-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 999px;
    font: 700 11px $font-family-base;
    border: none;
    cursor: pointer;
    transition:
      background 0.2s ease,
      transform 0.15s ease;
    white-space: nowrap;

    &:hover {
      transform: scale(1.05);
    }

    .mpc-status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    &.active {
      background: #dcfce7;
      color: #166534;

      .mpc-status-dot {
        background: #16a34a;
      }
    }

    &.inactive {
      background: #f3f4f6;
      color: #6b7280;

      .mpc-status-dot {
        background: #9ca3af;
      }
    }
  }
}

@keyframes pulse-badge {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.4);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(234, 88, 12, 0);
  }
}
</style>

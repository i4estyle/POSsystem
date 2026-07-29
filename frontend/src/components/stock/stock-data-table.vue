<template>
  <AppDataTable :rows="items" :columns="columns" row-key="sku">
    <template #body-cell-product="props">
      <div class="product-cell">
        <div class="product-avatar-badge" :class="getCategoryTheme(props.row.category)">
          <q-icon :name="getProductIcon(props.row.category)" size="22px" />
        </div>
        <div class="name-sku">
          <strong class="product-name">{{ props.row.name }}</strong>
          <span class="sku-code">SKU: {{ props.row.sku }}</span>
        </div>
      </div>
    </template>

    <template #body-cell-category="props">
      <div class="center-wrapper">
        <span class="category-chip" :class="getCategoryTheme(props.row.category)">
          {{ props.row.category }}
        </span>
      </div>
    </template>

    <template #body-cell-quantity="props">
      <div class="center-wrapper">
        <div class="qty-badge-box">
          <span class="qty-num">{{ props.row.quantity }}</span>
          <span class="qty-unit">{{ props.row.unit }}</span>
        </div>
      </div>
    </template>

    <template #body-cell-status="props">
      <div class="center-wrapper">
        <div class="status-glow-pill" :class="props.row.statusClass">
          <span class="glow-dot"></span>
          <span>{{ t(props.row.statusKey) }}</span>
        </div>
      </div>
    </template>

    <template #body-cell-lastUpdated="props">
      <div class="center-wrapper">
        <div class="time-cell">
          <q-icon name="schedule" size="14px" />
          <span>{{ props.row.lastUpdated }}</span>
        </div>
      </div>
    </template>

    <template #body-cell-actions="props">
      <div class="center-wrapper">
        <div class="action-buttons-group">
          <button
            type="button"
            class="icon-btn edit-btn"
            title="แก้ไข"
            @click="$emit('edit', props.row)"
          >
            <q-icon name="edit_note" size="20px" />
          </button>
          <button
            type="button"
            class="icon-btn restock-btn"
            title="เติมสต็อก"
            @click="$emit('restock', props.row)"
          >
            <q-icon name="add_shopping_cart" size="18px" />
          </button>
        </div>
      </div>
    </template>
  </AppDataTable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { QTableColumn } from 'quasar';
import AppDataTable from '@/components/base/app-data-table.vue';

const { t } = useI18n();

export interface StockItem extends Record<string, unknown> {
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  statusKey: string;
  statusClass: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
}

defineProps<{
  items: StockItem[];
}>();

defineEmits<{
  (e: 'edit', item: StockItem): void;
  (e: 'restock', item: StockItem): void;
}>();

const getProductIcon = (category: string): string => {
  const cat = category.toLowerCase();
  if (cat.includes('coffee')) return 'local_cafe';
  if (cat.includes('dairy')) return 'water_drop';
  if (cat.includes('syrup')) return 'liquor';
  if (cat.includes('tea')) return 'emoji_food_beverage';
  if (cat.includes('bakery')) return 'bakery_dining';
  return 'inventory_2';
};

const getCategoryTheme = (category: string): string => {
  const cat = category.toLowerCase();
  if (cat.includes('coffee')) return 'theme-purple';
  if (cat.includes('dairy')) return 'theme-blue';
  if (cat.includes('syrup')) return 'theme-pink';
  if (cat.includes('tea')) return 'theme-green';
  if (cat.includes('bakery')) return 'theme-yellow';
  return 'theme-default';
};

const columns = computed<QTableColumn<StockItem>[]>(() => [
  {
    name: 'product',
    label: t('stock.columns.product'),
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'category',
    label: t('stock.columns.category'),
    field: 'category',
    align: 'center',
    sortable: true,
  },
  {
    name: 'quantity',
    label: t('stock.columns.quantity'),
    field: 'quantity',
    align: 'center',
    sortable: true,
  },
  {
    name: 'status',
    label: t('stock.columns.status'),
    field: 'statusKey',
    align: 'center',
    sortable: true,
  },
  {
    name: 'lastUpdated',
    label: t('stock.columns.lastUpdated'),
    field: 'lastUpdated',
    align: 'center',
    sortable: true,
  },
  {
    name: 'actions',
    label: t('stock.columns.actions'),
    field: 'sku',
    align: 'center',
    sortable: false,
  },
]);
</script>

<style lang="scss" scoped>
@use '../../css/variables' as *;

.center-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.product-cell {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  width: 100%;

  .product-avatar-badge {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(99, 88, 128, 0.12);
    flex-shrink: 0;

    .q-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      margin: 0;
    }

    &.theme-purple {
      background: linear-gradient(135deg, $palette-purple 0%, rgba(208, 195, 241, 0.6) 100%);
      color: $color-primary-dark;
      border: 1px solid rgba(99, 88, 128, 0.15);
    }
    &.theme-blue {
      background: linear-gradient(135deg, $palette-blue 0%, rgba(206, 238, 248, 0.6) 100%);
      color: #1e5a6b;
      border: 1px solid rgba(30, 90, 107, 0.15);
    }
    &.theme-pink {
      background: linear-gradient(135deg, $palette-pink 0%, rgba(255, 215, 238, 0.6) 100%);
      color: #9d174d;
      border: 1px solid rgba(157, 23, 77, 0.15);
    }
    &.theme-green {
      background: linear-gradient(135deg, $palette-green 0%, rgba(233, 249, 229, 0.6) 100%);
      color: #276721;
      border: 1px solid rgba(39, 103, 33, 0.15);
    }
    &.theme-yellow {
      background: linear-gradient(135deg, $palette-yellow 0%, rgba(254, 241, 171, 0.6) 100%);
      color: #854d0e;
      border: 1px solid rgba(133, 77, 14, 0.15);
    }
    &.theme-default {
      background: $color-bg-card;
      color: $color-text-main;
      border: 1px solid rgba(0, 0, 0, 0.08);
    }
  }

  .name-sku {
    display: flex;
    flex-direction: column;
    text-align: left;

    .product-name {
      color: $color-text-main;
      font-size: 15px;
    }

    .sku-code {
      color: $color-text-muted;
      font-size: 12px;
    }
  }
}

.category-chip {
  display: inline-block;
  padding: 4px 14px;
  border-radius: $radius-full;
  font: 700 12px $font-family-base;

  &.theme-purple {
    background: rgba(208, 195, 241, 0.4);
    color: $color-primary-dark;
  }
  &.theme-blue {
    background: rgba(206, 238, 248, 0.6);
    color: #1e5a6b;
  }
  &.theme-pink {
    background: rgba(255, 215, 238, 0.6);
    color: #9d174d;
  }
  &.theme-green {
    background: rgba(233, 249, 229, 0.7);
    color: #276721;
  }
  &.theme-yellow {
    background: rgba(254, 241, 171, 0.7);
    color: #854d0e;
  }
}

.qty-badge-box {
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  background: $color-bg-subtle;
  padding: 4px 12px;
  border-radius: $radius-md;

  .qty-num {
    font:
      800 16px 'Plus Jakarta Sans',
      sans-serif;
    color: $color-text-main;
  }

  .qty-unit {
    font-size: 12px;
    color: $color-text-muted;
  }
}

.status-glow-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 5px 14px;
  border-radius: $radius-full;
  font: 700 12px $font-family-base;

  .glow-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      opacity: 0.4;
      animation: pulse 2s infinite;
    }
  }

  &.in-stock {
    background: #e9f9e5;
    color: #276721;
    .glow-dot {
      background: #22c55e;
      &::after {
        background: #22c55e;
      }
    }
  }

  &.low-stock {
    background: #fef1ab;
    color: #854d0e;
    .glow-dot {
      background: #eab308;
      &::after {
        background: #eab308;
      }
    }
  }

  &.out-of-stock {
    background: #ffd7ee;
    color: #9d174d;
    .glow-dot {
      background: #ef4444;
      &::after {
        background: #ef4444;
      }
    }
  }
}

.time-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: $color-text-muted;
  font-size: 13px;
}

.action-buttons-group {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: transparent;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &.edit-btn {
      color: $color-primary;
      &:hover {
        background: $palette-purple;
        color: $color-primary-dark;
        transform: scale(1.1);
      }
    }

    &.restock-btn {
      color: $color-secondary;
      &:hover {
        background: $palette-blue;
        color: #1e5a6b;
        transform: scale(1.1);
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.6);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>

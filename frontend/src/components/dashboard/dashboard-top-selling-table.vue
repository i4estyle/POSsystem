<template>
  <div class="top-selling-section">
    <div class="section-header">
      <div class="title-with-icon">
        <div class="header-icon-badge">
          <q-icon name="stars" size="22px" />
        </div>
        <div>
          <h3>{{ t('dashboard.topSelling.title') }}</h3>
          <small class="sub-text">ประจำวันตามจำนวนออเดอร์หน้าร้าน</small>
        </div>
      </div>
      <button type="button" class="view-all-btn" @click="$emit('view-all')">
        <span>{{ t('dashboard.topSelling.viewAll') }}</span>
        <q-icon name="arrow_forward" size="16px" />
      </button>
    </div>

    <AppDataTable :rows="topItems" :columns="columns" row-key="name">
      <template #body-cell-rank="props">
        <div class="center-wrapper">
          <div class="rank-pill" :class="`rank-${props.row.rank}`">{{ props.row.rank }}</div>
        </div>
      </template>

      <template #body-cell-name="props">
        <div class="item-cell">
          <div class="item-icon-bg" :class="props.row.category.toLowerCase()">
            <q-icon :name="props.row.icon" size="22px" />
          </div>
          <div class="item-meta">
            <strong>{{ props.row.name }}</strong>
            <small class="item-code">ID: {{ props.row.code }}</small>
          </div>
        </div>
      </template>

      <template #body-cell-category="props">
        <div class="center-wrapper">
          <span class="cat-pill" :class="props.row.category.toLowerCase()">
            <q-icon :name="getCategoryIcon(props.row.category)" size="14px" />
            {{ props.row.category }}
          </span>
        </div>
      </template>

      <template #body-cell-quantitySold="props">
        <div class="center-wrapper">
          <div class="qty-pill">
            <q-icon name="local_fire_department" size="15px" class="qty-fire" />
            <span>{{ props.row.quantitySold }}</span>
          </div>
        </div>
      </template>

      <template #body-cell-totalSales="props">
        <div class="center-wrapper">
          <span class="sales-amount">฿{{ props.row.totalSales.toLocaleString() }}</span>
        </div>
      </template>

      <template #body-cell-trend="props">
        <div class="center-wrapper">
          <div class="trend-badge-pill" :class="props.row.trendDir">
            <q-icon
              :name="props.row.trendDir === 'up' ? 'trending_up' : 'trending_down'"
              size="16px"
            />
            <span>{{ props.row.trendVal }}</span>
          </div>
        </div>
      </template>
    </AppDataTable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { QTableColumn } from 'quasar';
import AppDataTable from '@/components/base/app-data-table.vue';

const { t } = useI18n();

export interface TopSellingItem extends Record<string, unknown> {
  rank: number;
  code: string;
  name: string;
  category: string;
  quantitySold: string;
  totalSales: number;
  icon: string;
  trendDir: 'up' | 'down';
  trendVal: string;
}

defineEmits<{
  (e: 'view-all'): void;
}>();

const getCategoryIcon = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'beverage':
    case 'coffee':
      return 'local_cafe';
    case 'bakery':
      return 'bakery_dining';
    default:
      return 'category';
  }
};

const columns = computed<QTableColumn<TopSellingItem>[]>(() => [
  {
    name: 'rank',
    label: 'อันดับ',
    field: 'rank',
    align: 'center',
    sortable: true,
    style: 'width: 100px;',
  },
  {
    name: 'name',
    label: t('dashboard.topSelling.columns.item'),
    field: 'name',
    align: 'left',
    sortable: true,
    style: 'width: 280px; max-width: 280px;',
  },
  {
    name: 'category',
    label: t('dashboard.topSelling.columns.category'),
    field: 'category',
    align: 'center',
    sortable: true,
    style: 'width: 160px;',
  },
  {
    name: 'quantitySold',
    label: t('dashboard.topSelling.columns.quantitySold'),
    field: 'quantitySold',
    align: 'center',
    sortable: true,
    style: 'width: 160px;',
  },
  {
    name: 'totalSales',
    label: t('dashboard.topSelling.columns.sales'),
    field: 'totalSales',
    align: 'center',
    sortable: true,
    style: 'width: 160px;',
  },
  {
    name: 'trend',
    label: t('dashboard.topSelling.columns.trend'),
    field: 'trendVal',
    align: 'center',
    sortable: false,
    style: 'width: 140px;',
  },
]);

const topItems: TopSellingItem[] = [
  {
    rank: 1,
    code: 'BEV-01',
    name: 'Iced Lavender Latte',
    category: 'Beverage',
    quantitySold: '45 cups',
    totalSales: 4275,
    icon: 'local_cafe',
    trendDir: 'up',
    trendVal: '+18.5%',
  },
  {
    rank: 2,
    code: 'BAK-04',
    name: 'Butter Croissant',
    category: 'Bakery',
    quantitySold: '38 pcs',
    totalSales: 3230,
    icon: 'bakery_dining',
    trendDir: 'up',
    trendVal: '+12.3%',
  },
  {
    rank: 3,
    code: 'BEV-08',
    name: 'Kyoto Matcha Latte',
    category: 'Beverage',
    quantitySold: '30 cups',
    totalSales: 4950,
    icon: 'emoji_food_beverage',
    trendDir: 'up',
    trendVal: '+8.7%',
  },
];
</script>

<style lang="scss" scoped>
@use '../../css/variables' as *;

.top-selling-section {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title-with-icon {
      display: flex;
      align-items: center;
      gap: 12px;

      .header-icon-badge {
        width: 42px;
        height: 42px;
        border-radius: $radius-md;
        background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
        color: #fff;
        display: grid;
        place-items: center;
        box-shadow: 0 4px 12px rgba(99, 88, 128, 0.25);
      }

      h3 {
        margin: 0;
        color: $color-text-main;
        font: 700 20px/26px $font-family-base;
      }

      .sub-text {
        color: $color-text-muted;
        font: 13px/18px $font-family-base;
      }
    }

    .view-all-btn {
      height: 38px;
      padding: 0 16px;
      border: 1px solid rgba(99, 88, 128, 0.3);
      border-radius: $radius-full;
      background: $color-bg-surface;
      color: $color-primary;
      font: 700 13px $font-family-base;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: $color-primary;
        color: #fff;
        border-color: $color-primary;
        box-shadow: 0 4px 12px rgba(99, 88, 128, 0.2);
      }
    }
  }

  .center-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .rank-pill {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font:
      800 13px 'Plus Jakarta Sans',
      sans-serif;

    &.rank-1 {
      background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
      color: #5c3c00;
      box-shadow: 0 3px 8px rgba(255, 165, 0, 0.35);
    }
    &.rank-2 {
      background: linear-gradient(135deg, #e0e0e0 0%, #b0b0b0 100%);
      color: #333;
    }
    &.rank-3 {
      background: linear-gradient(135deg, #cd7f32 0%, #a0522d 100%);
      color: #fff;
    }
  }

  .item-cell {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 14px;
    width: 100%;

    .item-icon-bg {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, $palette-purple 0%, rgba(208, 195, 241, 0.6) 100%);
      color: $color-primary-dark;
      border: 1px solid rgba(99, 88, 128, 0.15);
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

      &.bakery {
        background: linear-gradient(135deg, $palette-blue 0%, rgba(206, 238, 248, 0.6) 100%);
        color: $color-secondary;
        border: 1px solid rgba(69, 99, 107, 0.15);
      }
    }

    .item-meta {
      display: flex;
      flex-direction: column;
      text-align: left;

      strong {
        color: $color-text-main;
        font-size: 15px;
      }

      .item-code {
        color: $color-text-muted;
        font-size: 12px;
      }
    }
  }

  .cat-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 4px 14px;
    border-radius: $radius-full;
    font: 700 12px $font-family-base;
    background: rgba(99, 88, 128, 0.1);
    color: $color-primary-dark;

    &.bakery {
      background: rgba(69, 99, 107, 0.12);
      color: $color-secondary;
    }
  }

  .qty-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: $color-text-main;
    font-weight: 700;

    .qty-fire {
      color: #f97316;
    }
  }

  .sales-amount {
    color: $color-primary-dark;
    font-weight: 800;
    font-size: 15px;
  }

  .trend-badge-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: $radius-full;
    font:
      700 12px 'Plus Jakarta Sans',
      sans-serif;

    &.up {
      background: #e9f9e5;
      color: #276721;
    }
    &.down {
      background: #ffd7ee;
      color: #9d174d;
    }
  }
}
</style>

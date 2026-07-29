<template>
  <AppDataTable :rows="items" :columns="columns" row-key="code">
    <template #body-cell-code="props">
      <div class="code-cell">
        <div class="promo-icon-badge">
          <q-icon name="local_offer" size="18px" />
        </div>
        <span class="code-text">{{ props.row.code }}</span>
      </div>
    </template>

    <template #body-cell-name="props">
      <div class="name-cell">
        <strong class="campaign-name">{{ props.row.name }}</strong>
      </div>
    </template>

    <template #body-cell-discount="props">
      <div class="center-wrapper">
        <span class="discount-pill">{{ props.row.discount }}</span>
      </div>
    </template>

    <template #body-cell-usage="props">
      <div class="center-wrapper">
        <span class="usage-badge">{{ props.row.usage }}</span>
      </div>
    </template>

    <template #body-cell-period="props">
      <div class="center-wrapper">
        <div class="period-cell">
          <q-icon name="date_range" size="14px" />
          <span>{{ props.row.period }}</span>
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

    <template #body-cell-actions="props">
      <div class="center-wrapper">
        <div class="action-buttons-group">
          <button
            type="button"
            class="icon-btn edit-btn"
            :title="t('promotions.editPromotion', { name: props.row.name })"
            @click="$emit('edit', props.row)"
          >
            <q-icon name="edit_note" size="20px" />
          </button>
          <button
            type="button"
            class="icon-btn toggle-btn"
            :class="{ active: props.row.statusClass === 'active' }"
            @click="$emit('toggle', props.row)"
          >
            <q-icon
              :name="props.row.statusClass === 'active' ? 'toggle_on' : 'toggle_off'"
              size="22px"
            />
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

export interface PromotionItem extends Record<string, unknown> {
  code: string;
  name: string;
  discount: string;
  usage: string;
  period: string;
  statusClass: 'active' | 'scheduled' | 'expired';
  statusKey: string;
}

defineProps<{
  items: PromotionItem[];
}>();

defineEmits<{
  (e: 'edit', item: PromotionItem): void;
  (e: 'toggle', item: PromotionItem): void;
}>();

const { t } = useI18n();

const sortString = (a: unknown, b: unknown): number => {
  const strA = typeof a === 'string' || typeof a === 'number' ? String(a) : '';
  const strB = typeof b === 'string' || typeof b === 'number' ? String(b) : '';
  return strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
};

const parseNum = (val: unknown): number => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[^0-9.-]+/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const columns = computed<QTableColumn<PromotionItem>[]>(() => [
  {
    name: 'code',
    required: true,
    label: t('promotions.table.code'),
    align: 'left',
    field: 'code',
    sortable: true,
    sort: (a, b) => sortString(a, b),
  },
  {
    name: 'name',
    required: true,
    label: t('promotions.table.name'),
    align: 'left',
    field: 'name',
    sortable: true,
    sort: (a, b) => sortString(a, b),
  },
  {
    name: 'discount',
    required: true,
    label: t('promotions.table.discount'),
    align: 'center',
    field: 'discount',
    sortable: true,
    sort: (a, b) => parseNum(a) - parseNum(b),
  },
  {
    name: 'usage',
    required: true,
    label: t('promotions.table.usage'),
    align: 'center',
    field: 'usage',
    sortable: true,
    sort: (a, b) => parseNum(a) - parseNum(b),
  },
  {
    name: 'period',
    required: true,
    label: t('promotions.table.period'),
    align: 'center',
    field: 'period',
    sortable: true,
    sort: (a, b) => sortString(a, b),
  },
  {
    name: 'status',
    required: true,
    label: t('promotions.table.status'),
    align: 'center',
    field: 'statusClass',
    sortable: true,
    sort: (a, b) => sortString(a, b),
  },
  {
    name: 'actions',
    required: true,
    label: t('promotions.table.actions'),
    align: 'center',
    field: (row) => row.code,
  },
]);
</script>

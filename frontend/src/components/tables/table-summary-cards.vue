<template>
  <div class="summary-cards-grid">
    <div v-for="card in cards" :key="card.labelKey" class="stat-card">
      <span class="stat-label">{{ t(card.labelKey) }}</span>
      <span class="stat-value">{{ card.value }}</span>
      <div class="stat-footer">
        <span class="trend-badge" :class="card.trendDir">
          {{ card.trendKey ? t(card.trendKey) : card.trend }}
        </span>
        <span class="trend-period">{{ t(card.periodKey) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TableManagementItem } from '@/types/dining-table';

const { t } = useI18n();

const props = defineProps<{
  tables: TableManagementItem[];
}>();

const activeOrdersCount = computed(
  () => props.tables.filter((item) => item.status === 'occupied').length,
);

const totalRevenue = computed(() =>
  props.tables.reduce((sum, item) => sum + (item.totalAmount || 0), 0),
);

const occupancyPercentage = computed(() => {
  if (!props.tables.length) return 0;
  const occupied = props.tables.filter((item) => item.status === 'occupied').length;
  return Math.round((occupied / props.tables.length) * 100);
});

interface StatCardItem {
  labelKey: string;
  value: string;
  trend?: string;
  trendKey?: string;
  trendDir: 'up' | 'down';
  periodKey: string;
}

const cards = computed<StatCardItem[]>(() => [
  {
    labelKey: 'tables.stats.activeOrders',
    value: `${activeOrdersCount.value}`,
    trend: '+2',
    trendDir: 'up',
    periodKey: 'statsPeriods.vsLastMonth',
  },
  {
    labelKey: 'tables.stats.waitTime',
    value: '~15m',
    trendKey: 'statsPeriods.normalStatus',
    trendDir: 'up',
    periodKey: 'statsPeriods.activeNow',
  },
  {
    labelKey: 'tables.stats.revenue',
    value: `฿${totalRevenue.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    trend: '+12.4%',
    trendDir: 'up',
    periodKey: 'statsPeriods.vsLastMonth',
  },
  {
    labelKey: 'tables.stats.occupancy',
    value: `${occupancyPercentage.value}%`,
    trend: `${occupancyPercentage.value}%`,
    trendDir: 'up',
    periodKey: 'statsPeriods.shiftCapacity',
  },
]);
</script>

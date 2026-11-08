<template>
  <div class="summary-cards-grid">
    <div v-for="card in cards" :key="card.labelKey" class="stat-card">
      <span class="stat-label">{{ t(card.labelKey) }}</span>
      <span class="stat-value">{{ card.value }}</span>
      <div class="stat-footer">
        <span class="trend-badge" :class="card.trendDir">
          {{ card.trend }}
        </span>
        <span class="trend-period">{{ periodComparisonText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDashboardStore } from '@/stores/dashboard-store';

const { t } = useI18n();
const dashboardStore = useDashboardStore();

interface StatCardItem {
  labelKey: string;
  value: string;
  trend: string;
  trendDir: 'up' | 'down';
}

const periodComparisonText = computed(() => {
  switch (dashboardStore.timeFilter) {
    case 'month':
      return 'เทียบเดือนที่แล้ว';
    case 'year':
      return 'เทียบปีที่แล้ว';
    case 'custom':
      return 'เทียบช่วงก่อนหน้า';
    case 'today':
    default:
      return t('dashboard.cards.vsYesterday');
  }
});

const cards = computed<StatCardItem[]>(() => [
  {
    labelKey: 'dashboard.cards.todaySales',
    value: dashboardStore.summary.todaySales,
    trend: dashboardStore.summary.salesTrend,
    trendDir: dashboardStore.summary.salesTrendDir,
  },
  {
    labelKey: 'dashboard.cards.totalBills',
    value: dashboardStore.summary.totalBills,
    trend: dashboardStore.summary.billsTrend,
    trendDir: dashboardStore.summary.billsTrendDir,
  },
  {
    labelKey: 'dashboard.cards.itemsSold',
    value: dashboardStore.summary.itemsSold,
    trend: dashboardStore.summary.itemsTrend,
    trendDir: dashboardStore.summary.itemsTrendDir,
  },
  {
    labelKey: 'dashboard.cards.avgPerBill',
    value: dashboardStore.summary.avgPerBill,
    trend: dashboardStore.summary.avgTrend,
    trendDir: dashboardStore.summary.avgTrendDir,
  },
]);
</script>

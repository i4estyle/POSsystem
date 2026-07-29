<template>
  <div class="summary-cards-grid">
    <div v-for="card in cards" :key="card.labelKey" class="stat-card">
      <span class="stat-label">{{ t(card.labelKey) }}</span>
      <span class="stat-value">{{ card.value }}</span>
      <div class="stat-footer">
        <span class="trend-badge" :class="card.trendDir">
          {{ card.trend }}
        </span>
        <span class="trend-period">{{ t('dashboard.cards.vsYesterday') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface StatCardItem {
  labelKey: string;
  value: string;
  trend: string;
  trendDir: 'up' | 'down';
}

const cards = computed<StatCardItem[]>(() => [
  {
    labelKey: 'dashboard.cards.todaySales',
    value: '฿12,480',
    trend: '+12.5%',
    trendDir: 'up',
  },
  {
    labelKey: 'dashboard.cards.totalBills',
    value: '143',
    trend: '+8.2%',
    trendDir: 'up',
  },
  {
    labelKey: 'dashboard.cards.itemsSold',
    value: '287',
    trend: '+15.4%',
    trendDir: 'up',
  },
  {
    labelKey: 'dashboard.cards.avgPerBill',
    value: '฿87',
    trend: '-2.1%',
    trendDir: 'down',
  },
]);
</script>

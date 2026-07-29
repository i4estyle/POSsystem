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

const { t } = useI18n();

interface PromotionStatCard {
  labelKey: string;
  value: string;
  trend?: string;
  trendKey?: string;
  trendDir: 'up' | 'down';
  periodKey: string;
}

const cards = computed<PromotionStatCard[]>(() => [
  {
    labelKey: 'promotions.stats.total',
    value: '12',
    trend: '+2',
    trendDir: 'up',
    periodKey: 'statsPeriods.campaignsCreated',
  },
  {
    labelKey: 'promotions.stats.active',
    value: '5',
    trendKey: 'statsPeriods.activeTrend',
    trendDir: 'up',
    periodKey: 'statsPeriods.liveCurrently',
  },
  {
    labelKey: 'promotions.stats.totalDiscounts',
    value: '฿48,600',
    trend: '+12.4%',
    trendDir: 'up',
    periodKey: 'statsPeriods.totalSavingsGranted',
  },
  {
    labelKey: 'promotions.stats.expiringSoon',
    value: '2',
    trendKey: 'statsPeriods.daysLeft7',
    trendDir: 'down',
    periodKey: 'statsPeriods.requiresReview',
  },
]);
</script>

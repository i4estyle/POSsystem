<template>
  <div class="summary-cards-grid">
    <div v-for="card in cards" :key="card.labelKey" class="stat-card">
      <span class="stat-label">{{ t(card.labelKey) }}</span>
      <span class="stat-value">{{ card.value }}</span>
      <div class="stat-footer">
        <span class="trend-badge" :class="card.trendDir">
          {{ card.trend }}
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

interface MemberStatCard {
  labelKey: string;
  value: string;
  trend: string;
  trendDir: 'up' | 'down';
  periodKey: string;
}

const cards = computed<MemberStatCard[]>(() => [
  {
    labelKey: 'members.stats.total',
    value: '1,420',
    trend: '+14.2%',
    trendDir: 'up',
    periodKey: 'statsPeriods.vsLastMonth',
  },
  {
    labelKey: 'members.stats.active',
    value: '890',
    trend: '+6.8%',
    trendDir: 'up',
    periodKey: 'statsPeriods.activeThisMonth',
  },
  {
    labelKey: 'members.stats.pointsIssued',
    value: '124,500',
    trend: '+18.5%',
    trendDir: 'up',
    periodKey: 'statsPeriods.pointsEarned',
  },
  {
    labelKey: 'members.stats.vipMembers',
    value: '68',
    trend: '+3',
    trendDir: 'up',
    periodKey: 'statsPeriods.platinumAndVip',
  },
]);
</script>

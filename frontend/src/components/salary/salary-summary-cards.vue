<template>
  <div class="summary-cards-grid">
    <div v-for="card in cards" :key="card.labelKey" class="stat-card">
      <span class="stat-label">{{ t(card.labelKey, { month: t('payroll.monthFormat') }) }}</span>
      <span class="stat-value">{{ card.amount }}</span>
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

interface PayrollStatCard {
  labelKey: string;
  amount: string;
  trend: string;
  trendDir: 'up' | 'down';
  periodKey: string;
}

const cards = computed<PayrollStatCard[]>(() => [
  {
    labelKey: 'payroll.summary.totalPayroll',
    amount: '฿245,000',
    trend: '+4.2%',
    trendDir: 'up',
    periodKey: 'statsPeriods.vsLastMonth',
  },
  {
    labelKey: 'payroll.summary.baseSalaryPaid',
    amount: '฿210,000',
    trend: '100%',
    trendDir: 'up',
    periodKey: 'statsPeriods.baseSalary',
  },
  {
    labelKey: 'payroll.summary.overtimeBonuses',
    amount: '฿42,500',
    trend: '+8.5%',
    trendDir: 'up',
    periodKey: 'statsPeriods.otAndBonus',
  },
  {
    labelKey: 'payroll.summary.totalDeductions',
    amount: '-฿7,500',
    trend: '-1.2%',
    trendDir: 'down',
    periodKey: 'statsPeriods.taxAndSocial',
  },
]);
</script>

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
import type { EmployeeInfo } from './employee-card.vue';

const { t } = useI18n();

const props = defineProps<{
  employees: EmployeeInfo[];
}>();

const totalStaff = computed(() => props.employees.length);
const onDutyCount = computed(() => props.employees.filter((e) => e.isOnDuty).length);
const offDutyCount = computed(() => totalStaff.value - onDutyCount.value);
const coveragePercentage = computed(() =>
  totalStaff.value ? Math.round((onDutyCount.value / totalStaff.value) * 100) : 0,
);

interface StatCard {
  labelKey: string;
  value: string;
  trend?: string;
  trendKey?: string;
  trendDir: 'up' | 'down';
  periodKey: string;
}

const cards = computed<StatCard[]>(() => [
  {
    labelKey: 'staff.stats.totalStaff',
    value: `${totalStaff.value}`,
    trend: '+1',
    trendDir: 'up',
    periodKey: 'statsPeriods.vsLastMonth',
  },
  {
    labelKey: 'staff.stats.onDuty',
    value: `${onDutyCount.value}`,
    trend: `${coveragePercentage.value}%`,
    trendDir: 'up',
    periodKey: 'statsPeriods.activeNow',
  },
  {
    labelKey: 'staff.stats.offDuty',
    value: `${offDutyCount.value}`,
    trendKey: 'statsPeriods.normalStatus',
    trendDir: 'down',
    periodKey: 'statsPeriods.restShiftOff',
  },
  {
    labelKey: 'staff.stats.coverage',
    value: `${coveragePercentage.value}%`,
    trend: '+5%',
    trendDir: 'up',
    periodKey: 'statsPeriods.shiftCapacity',
  },
]);
</script>

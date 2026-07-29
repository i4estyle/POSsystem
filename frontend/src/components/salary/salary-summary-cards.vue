<template>
  <div class="payroll-summary-grid">
    <div v-for="item in stats" :key="item.titleKey" class="summary-card">
      <span class="card-title">{{ t(item.titleKey, { month: t('payroll.monthFormat') }) }}</span>
      <span class="card-amount">{{ item.amount }}</span>
      <span class="card-subtext">{{ t(item.subtextKey) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface PayrollStat {
  titleKey: string;
  amount: string;
  subtextKey: string;
}

const stats = computed<PayrollStat[]>(() => [
  {
    titleKey: 'payroll.summary.totalPayroll',
    amount: '฿245,000',
    subtextKey: 'staff.title',
  },
  {
    titleKey: 'payroll.summary.baseSalaryPaid',
    amount: '฿210,000',
    subtextKey: 'payroll.columns.baseSalary',
  },
  {
    titleKey: 'payroll.summary.overtimeBonuses',
    amount: '฿42,500',
    subtextKey: 'payroll.columns.otBonus',
  },
  {
    titleKey: 'payroll.summary.totalDeductions',
    amount: '-฿7,500',
    subtextKey: 'payroll.columns.deductions',
  },
]);
</script>

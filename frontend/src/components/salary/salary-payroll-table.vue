<template>
  <AppDataTable :rows="rows" :columns="columns" row-key="employeeId">
    <template #body-cell-employee="props">
      <div class="employee-cell">
        <div class="emp-avatar-gradient">
          {{ props.row.name.charAt(0) }}
        </div>
        <div class="emp-info">
          <strong class="emp-name">{{ props.row.name }}</strong>
          <span class="emp-id">{{ props.row.employeeId }}</span>
        </div>
      </div>
    </template>

    <template #body-cell-role="props">
      <div class="role-chip">
        <q-icon name="badge" size="14px" />
        <span>{{ props.row.role }}</span>
      </div>
    </template>

    <template #body-cell-baseSalary="props">
      <div class="center-wrapper">
        <span class="base-salary">฿{{ props.row.baseSalary.toLocaleString() }}</span>
      </div>
    </template>

    <template #body-cell-overtimeBonus="props">
      <div class="center-wrapper">
        <span class="ot-bonus">+฿{{ props.row.overtimeBonus.toLocaleString() }}</span>
      </div>
    </template>

    <template #body-cell-deductions="props">
      <div class="center-wrapper">
        <span class="deduction-val">-฿{{ props.row.deductions.toLocaleString() }}</span>
      </div>
    </template>

    <template #body-cell-netPay="props">
      <div class="center-wrapper">
        <div class="net-pay-badge">฿{{ props.row.netPay.toLocaleString() }}</div>
      </div>
    </template>

    <template #body-cell-status="props">
      <div class="center-wrapper">
        <div class="payroll-status-pill" :class="props.row.status === 'Paid' ? 'paid' : 'pending'">
          <q-icon :name="props.row.status === 'Paid' ? 'check_circle' : 'pending'" size="16px" />
          <span>{{
            props.row.status === 'Paid' ? t('payroll.status.paid') : t('payroll.status.pending')
          }}</span>
        </div>
      </div>
    </template>

    <template #body-cell-actions="props">
      <div class="center-wrapper">
        <button
          type="button"
          class="payslip-action-btn"
          title="ดูใบเสร็จเงินเดือน"
          @click="$emit('view-slip', props.row)"
        >
          <q-icon name="receipt_long" size="18px" />
          <span>Slip</span>
        </button>
      </div>
    </template>
  </AppDataTable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { QTableColumn } from 'quasar';
import AppDataTable from '@/components/base/app-data-table.vue';

const { t } = useI18n();

export interface PayrollRow extends Record<string, unknown> {
  employeeId: string;
  name: string;
  role: string;
  baseSalary: number;
  overtimeBonus: number;
  deductions: number;
  netPay: number;
  status: 'Paid' | 'Pending';
}

defineProps<{
  rows: PayrollRow[];
}>();

defineEmits<{
  (e: 'view-slip', row: PayrollRow): void;
}>();

const columns = computed<QTableColumn<PayrollRow>[]>(() => [
  {
    name: 'employee',
    label: t('payroll.columns.employee'),
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'role',
    label: t('payroll.columns.role'),
    field: 'role',
    align: 'left',
    sortable: true,
  },
  {
    name: 'baseSalary',
    label: t('payroll.columns.baseSalary'),
    field: 'baseSalary',
    align: 'center',
    sortable: true,
  },
  {
    name: 'overtimeBonus',
    label: t('payroll.columns.otBonus'),
    field: 'overtimeBonus',
    align: 'center',
    sortable: true,
  },
  {
    name: 'deductions',
    label: t('payroll.columns.deductions'),
    field: 'deductions',
    align: 'center',
    sortable: true,
  },
  {
    name: 'netPay',
    label: t('payroll.columns.netPay'),
    field: 'netPay',
    align: 'center',
    sortable: true,
  },
  {
    name: 'status',
    label: t('payroll.columns.status'),
    field: 'status',
    align: 'center',
    sortable: true,
  },
  {
    name: 'actions',
    label: t('payroll.columns.actions'),
    field: 'employeeId',
    align: 'center',
    sortable: false,
  },
]);
</script>

<style lang="scss" scoped>
@use '../../css/variables' as *;

.center-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.employee-cell {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;

  .emp-avatar-gradient {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
    color: #fff;
    font:
      800 16px 'Plus Jakarta Sans',
      sans-serif;
    display: grid;
    place-items: center;
    box-shadow: 0 3px 10px rgba(99, 88, 128, 0.25);
    flex-shrink: 0;
  }

  .emp-info {
    display: flex;
    flex-direction: column;
    text-align: left;

    .emp-name {
      color: $color-text-main;
      font-size: 15px;
    }

    .emp-id {
      color: $color-text-muted;
      font-size: 12px;
    }
  }
}

.role-chip {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  padding: 4px 12px;
  border-radius: $radius-full;
  background: $color-bg-subtle;
  color: $color-text-body;
  font: 600 13px $font-family-base;
}

.base-salary {
  font-weight: 700;
  color: $color-text-main;
}

.ot-bonus {
  font-weight: 700;
  color: #16a34a;
}

.deduction-val {
  font-weight: 700;
  color: #dc2626;
}

.net-pay-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: $radius-md;
  background: rgba(208, 195, 241, 0.35);
  color: $color-primary-dark;
  font:
    800 15px 'Plus Jakarta Sans',
    sans-serif;
}

.payroll-status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: $radius-full;
  font: 700 12px $font-family-base;

  &.paid {
    background: #e9f9e5;
    color: #276721;
  }

  &.pending {
    background: #fef1ab;
    color: #854d0e;
  }
}

.payslip-action-btn {
  height: 34px;
  padding: 0 14px;
  border: 1px solid rgba(99, 88, 128, 0.3);
  border-radius: $radius-full;
  background: #fff;
  color: $color-primary;
  font: 700 12px $font-family-base;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: $color-primary;
    color: #fff;
    border-color: $color-primary;
    box-shadow: 0 4px 10px rgba(99, 88, 128, 0.2);
  }
}
</style>

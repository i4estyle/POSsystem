<template>
  <q-page class="salary-page">
    <section class="pos-sales-layout salary-layout">
      <PosSidebarNav @new-order="notifyNewOrder" />
      <main class="pos-main-wrapper salary-main">
        <PosHeaderBar />

        <section class="salary-content">
          <header class="salary-header">
            <div>
              <h1>{{ t('payroll.title') }}</h1>
              <small>{{ t('payroll.subtitle', { month: t('payroll.monthFormat') }) }}</small>
            </div>
            <div class="header-controls">
              <div class="month-picker">
                <q-icon name="calendar_month" size="20px" />
                <span>{{ t('payroll.monthFormat') }}</span>
              </div>
              <button type="button" class="export-btn" @click="onExportReport">
                <q-icon name="download" size="20px" />
                <span>{{ t('payroll.exportReport') }}</span>
              </button>
            </div>
          </header>

          <SalarySummaryCards />

          <SalaryPayrollTable :rows="filteredPayroll" @view-slip="onViewPayslip" />
        </section>
      </main>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useSearchState } from '@/composables/use-search-state';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import SalarySummaryCards from '@/components/salary/salary-summary-cards.vue';
import SalaryPayrollTable, { type PayrollRow } from '@/components/salary/salary-payroll-table.vue';

const $q = useQuasar();
const { t } = useI18n();
const { searchQuery } = useSearchState();

const payrollData: PayrollRow[] = [
  {
    employeeId: 'EMP-001',
    name: 'Alex Rivera',
    role: 'Store Manager',
    baseSalary: 45000,
    overtimeBonus: 8500,
    deductions: 1500,
    netPay: 52000,
    status: 'Paid',
  },
  {
    employeeId: 'EMP-002',
    name: 'Sarah Chen',
    role: 'Head Barista',
    baseSalary: 38000,
    overtimeBonus: 6000,
    deductions: 1200,
    netPay: 42800,
    status: 'Paid',
  },
  {
    employeeId: 'EMP-003',
    name: 'Marcus Vance',
    role: 'Barista',
    baseSalary: 28000,
    overtimeBonus: 4500,
    deductions: 1000,
    netPay: 31500,
    status: 'Paid',
  },
  {
    employeeId: 'EMP-004',
    name: 'Emily Watson',
    role: 'Pastry Chef',
    baseSalary: 35000,
    overtimeBonus: 7000,
    deductions: 1200,
    netPay: 40800,
    status: 'Paid',
  },
  {
    employeeId: 'EMP-005',
    name: 'David Kim',
    role: 'Cashier / POS',
    baseSalary: 25000,
    overtimeBonus: 3200,
    deductions: 900,
    netPay: 27300,
    status: 'Pending',
  },
  {
    employeeId: 'EMP-006',
    name: 'Jessica Taylor',
    role: 'Shift Supervisor',
    baseSalary: 32000,
    overtimeBonus: 5300,
    deductions: 1100,
    netPay: 36200,
    status: 'Pending',
  },
];

const filteredPayroll = computed(() =>
  payrollData.filter((row) => {
    if (!searchQuery.value) return true;
    const q = searchQuery.value.toLowerCase();
    return (
      row.name.toLowerCase().includes(q) ||
      row.role.toLowerCase().includes(q) ||
      row.employeeId.toLowerCase().includes(q)
    );
  }),
);

const notifyNewOrder = (): void => {
  $q.notify({ message: t('orders.newOrderPending'), color: 'primary', position: 'top' });
};

const onExportReport = (): void => {
  $q.notify({
    message: t('payroll.exportSuccess'),
    color: 'positive',
    position: 'top',
  });
};

const onViewPayslip = (row: PayrollRow): void => {
  $q.notify({
    message: t('payroll.approveSuccess', { name: row.name }),
    color: 'primary',
    position: 'top',
  });
};
</script>

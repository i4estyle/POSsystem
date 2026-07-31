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
              <small>{{ t('payroll.subtitle', { month: salaryStore.monthFilter }) }}</small>
            </div>
            <div class="header-controls">
              <button type="button" class="export-btn" @click="openAddDialog">
                <q-icon name="add" size="20px" />
                <span>{{ t('payroll.addRecord') }}</span>
              </button>
              <button type="button" class="export-btn" @click="onExportReport">
                <q-icon name="download" size="20px" />
                <span>{{ t('payroll.exportReport') }}</span>
              </button>
            </div>
          </header>

          <SalarySummaryCards />

          <SalaryPayrollTable :rows="tableRows" @view-slip="onEditRecord" />
        </section>
      </main>
    </section>

    <!-- Salary Form Dialog -->
    <SalaryFormDialog v-model="showFormModal" :record="editingRecord" @save="onSaveRecord" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useSalaryStore, type SalaryRecord } from '@/stores/salary-store';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import SalarySummaryCards from '@/components/salary/salary-summary-cards.vue';
import SalaryPayrollTable, { type PayrollRow } from '@/components/salary/salary-payroll-table.vue';
import SalaryFormDialog from '@/components/salary/salary-form-dialog.vue';

const $q = useQuasar();
const { t } = useI18n();
const salaryStore = useSalaryStore();

const showFormModal = ref(false);
const editingRecord = ref<SalaryRecord | null>(null);

const tableRows = computed<PayrollRow[]>(() =>
  salaryStore.filteredRecords.map((r) => ({
    employeeId: `EMP-${String(r.employeeId).padStart(3, '0')}`,
    name: r.employeeName,
    role: r.role,
    baseSalary: r.baseSalary,
    overtimeBonus: r.overtimePay + r.bonus,
    deductions: r.deduction,
    netPay: r.totalNet,
    status: r.paymentStatus === 'paid' ? 'Paid' : 'Pending',
    rawRecord: r,
  })),
);

const openAddDialog = (): void => {
  editingRecord.value = null;
  showFormModal.value = true;
};

const onEditRecord = (row: { rawRecord?: SalaryRecord; name: string }): void => {
  const record =
    row.rawRecord || salaryStore.records.find((r) => r.employeeName === row.name) || null;
  if (!record) return;

  if (record.paymentStatus === 'pending') {
    $q.dialog({
      title: t('payroll.manageRecordTitle'),
      message: t('payroll.manageRecordMessage', { name: record.employeeName }),
      options: {
        type: 'radio',
        model: 'pay',
        items: [
          { label: t('payroll.markAsPaid'), value: 'pay' },
          { label: t('payroll.editRecord'), value: 'edit' },
        ],
      },
      cancel: true,
      persistent: true,
    }).onOk((opt: string) => {
      if (opt === 'pay') {
        salaryStore.markAsPaid(record.id);
        $q.notify({
          type: 'positive',
          message: t('payroll.approvePaidSuccess', { name: record.employeeName }),
          position: 'top',
        });
      } else {
        editingRecord.value = record;
        showFormModal.value = true;
      }
    });
  } else {
    editingRecord.value = record;
    showFormModal.value = true;
  }
};

const onSaveRecord = (
  payload: Omit<SalaryRecord, 'id' | 'totalNet'> | Partial<SalaryRecord>,
): void => {
  if (editingRecord.value) {
    salaryStore.updateSalaryRecord(editingRecord.value.id, payload);
    $q.notify({
      type: 'positive',
      message: t('settings.saveSuccess'),
      position: 'top',
    });
  } else {
    salaryStore.addSalaryRecord(payload as Omit<SalaryRecord, 'id' | 'totalNet'>);
    $q.notify({
      type: 'positive',
      message: t('payroll.saveRecordSuccess'),
      position: 'top',
    });
  }
};

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
</script>

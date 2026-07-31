<template>
  <q-page class="employee-page">
    <section class="pos-sales-layout employee-layout">
      <PosSidebarNav @new-order="notifyNewOrder" />
      <main class="pos-main-wrapper employee-main">
        <PosHeaderBar />

        <section class="employee-content">
          <header class="employee-header">
            <div>
              <h1>{{ t('staff.title') }}</h1>
              <small>{{ t('staff.subtitle', { branch: currentBranchName }) }}</small>
            </div>
            <div class="header-actions">
              <button type="button" class="add-staff-btn" @click="openAddDialog">
                <q-icon name="add" size="20px" />
                <span>{{ t('staff.newEmployee') }}</span>
              </button>
            </div>
          </header>

          <EmployeeSummaryCards :employees="summaryEmployees" />

          <div class="filter-toolbar">
            <div class="role-filter-chips">
              <button
                v-for="filter in roleFilters"
                :key="filter.key"
                type="button"
                class="filter-chip"
                :class="{ active: employeeStore.roleFilter === filter.key }"
                @click="employeeStore.roleFilter = filter.key"
              >
                <span>{{ t(filter.labelKey) }}</span>
              </button>
            </div>
          </div>

          <EmployeeDataTable :items="tableRows" @edit="openEditDialog" />
        </section>
      </main>
    </section>

    <!-- Employee Form Dialog -->
    <EmployeeFormDialog
      v-model="showFormModal"
      :employee="editingEmployee"
      @save="onSaveEmployee"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { useEmployeeStore, type EmployeeItem } from '@/stores/employee-store';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import EmployeeSummaryCards from '@/components/employee/employee-summary-cards.vue';
import EmployeeDataTable from '@/components/employee/employee-data-table.vue';
import EmployeeFormDialog from '@/components/employee/employee-form-dialog.vue';
import type { EmployeeInfo } from '@/components/employee/employee-card.vue';

const $q = useQuasar();
const { t } = useI18n();
const authStore = useAuthStore();
const employeeStore = useEmployeeStore();

const showFormModal = ref(false);
const editingEmployee = ref<EmployeeItem | null>(null);

const roleFilters = [
  { key: 'all', labelKey: 'staff.filters.all' },
  { key: 'ผู้จัดการสาขา (Branch Manager)', labelKey: 'staff.filters.manager' },
  { key: 'พนักงานบริการ (Barista / Service)', labelKey: 'staff.filters.barista' },
  { key: 'หัวหน้าห้องครัว (Executive Chef)', labelKey: 'staff.filters.chef' },
  { key: 'พนักงานแคชเชียร์ (Head Cashier)', labelKey: 'staff.filters.cashier' },
];

const currentBranchName = computed(
  () =>
    authStore.currentUser?.branchName ||
    authStore.currentUser?.branch?.branchName ||
    'สาขาหลัก (Main Branch)',
);

const summaryEmployees = computed<EmployeeInfo[]>(() =>
  employeeStore.employees.map((e) => ({
    name: `${e.firstName} ${e.lastName}`,
    role: e.role,
    email: e.email,
    phone: e.phone,
    employeeId: e.code,
    isOnDuty: e.status === 'active',
    shiftInfo: e.branch,
  })),
);

const tableRows = computed<EmployeeInfo[]>(() =>
  employeeStore.filteredEmployees.map((e) => ({
    id: e.id,
    name: `${e.firstName} ${e.lastName}`,
    role: e.role,
    email: e.email,
    phone: e.phone,
    employeeId: e.code,
    isOnDuty: e.status === 'active',
    shiftInfo: e.branch,
    rawEmployee: e,
  })),
);

const openAddDialog = (): void => {
  editingEmployee.value = null;
  showFormModal.value = true;
};

const openEditDialog = (item: {
  rawEmployee?: EmployeeItem;
  employeeId: string;
  name: string;
}): void => {
  editingEmployee.value =
    item.rawEmployee || employeeStore.employees.find((e) => e.code === item.employeeId) || null;
  showFormModal.value = true;
};

const onSaveEmployee = (
  payload: Omit<EmployeeItem, 'id' | 'code'> | Partial<EmployeeItem>,
): void => {
  if (editingEmployee.value) {
    employeeStore.updateEmployee(editingEmployee.value.id, payload);
    $q.notify({
      type: 'positive',
      message: t('settings.saveSuccess'),
      position: 'top',
    });
  } else {
    employeeStore.addEmployee(payload as Omit<EmployeeItem, 'id' | 'code'>);
    $q.notify({
      type: 'positive',
      message: 'เพิ่มข้อมูลพนักงานสำเร็จ',
      position: 'top',
    });
  }
};

const notifyNewOrder = (): void => {
  $q.notify({ message: t('orders.newOrderPending'), color: 'primary', position: 'top' });
};
</script>

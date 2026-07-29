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
              <button type="button" class="add-staff-btn" @click="onAddEmployee">
                <q-icon name="add" size="20px" />
                <span>{{ t('staff.newEmployee') }}</span>
              </button>
            </div>
          </header>

          <div class="staff-grid">
            <EmployeeCard v-for="emp in filteredEmployees" :key="emp.employeeId" :employee="emp" />
          </div>
        </section>
      </main>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { useSearchState } from '@/composables/use-search-state';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import EmployeeCard, { type EmployeeInfo } from '@/components/employee/employee-card.vue';

const $q = useQuasar();
const { t } = useI18n();
const authStore = useAuthStore();
const { searchQuery } = useSearchState();

const currentBranchName = computed(
  () =>
    authStore.currentUser?.branchName ||
    authStore.currentUser?.branch?.branchName ||
    'Downtown Branch',
);

const employees: EmployeeInfo[] = [
  {
    name: 'Alex Rivera',
    role: 'Store Manager',
    email: 'alex.rivera@cafelypos.com',
    phone: '081-234-5678',
    employeeId: 'EMP-001',
    isOnDuty: true,
    shiftInfo: 'Morning Shift (07:00 - 16:00)',
  },
  {
    name: 'Sarah Chen',
    role: 'Head Barista',
    email: 'sarah.c@cafelypos.com',
    phone: '082-345-6789',
    employeeId: 'EMP-002',
    isOnDuty: true,
    shiftInfo: 'Morning Shift (07:00 - 16:00)',
  },
  {
    name: 'Marcus Vance',
    role: 'Barista',
    email: 'marcus.v@cafelypos.com',
    phone: '083-456-7890',
    employeeId: 'EMP-003',
    isOnDuty: true,
    shiftInfo: 'Full Day (08:00 - 17:00)',
  },
  {
    name: 'Emily Watson',
    role: 'Pastry Chef',
    email: 'emily.w@cafelypos.com',
    phone: '084-567-8901',
    employeeId: 'EMP-004',
    isOnDuty: false,
    shiftInfo: 'Off Duty (Next: Tomorrow 06:00)',
  },
  {
    name: 'David Kim',
    role: 'Cashier / POS',
    email: 'david.k@cafelypos.com',
    phone: '085-678-9012',
    employeeId: 'EMP-005',
    isOnDuty: true,
    shiftInfo: 'Evening Shift (12:00 - 21:00)',
  },
  {
    name: 'Jessica Taylor',
    role: 'Shift Supervisor',
    email: 'jessica.t@cafelypos.com',
    phone: '086-789-0123',
    employeeId: 'EMP-006',
    isOnDuty: false,
    shiftInfo: 'Off Duty (Next: Tomorrow 12:00)',
  },
];

const filteredEmployees = computed(() =>
  employees.filter((emp) => {
    if (!searchQuery.value) return true;
    const q = searchQuery.value.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.employeeId.toLowerCase().includes(q)
    );
  }),
);

const notifyNewOrder = (): void => {
  $q.notify({ message: t('orders.newOrderPending'), color: 'primary', position: 'top' });
};

const onAddEmployee = (): void => {
  $q.notify({
    message: t('staff.addEmployeePending'),
    color: 'primary',
    position: 'top',
  });
};
</script>

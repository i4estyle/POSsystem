<template>
  <AppDataTable
    :rows="items as unknown as Record<string, unknown>[]"
    :columns="columns"
    row-key="employeeId"
  >
    <template #body-cell-employeeId="props">
      <div class="emp-id-cell">
        <span class="id-tag">{{ (props.row as unknown as EmployeeInfo).employeeId }}</span>
      </div>
    </template>

    <template #body-cell-name="props">
      <div class="emp-name-cell">
        <div
          class="emp-avatar-gradient"
          :class="getAvatarTheme((props.row as unknown as EmployeeInfo).role)"
        >
          {{ (props.row as unknown as EmployeeInfo).name.charAt(0) }}
        </div>
        <div class="name-email">
          <strong class="emp-name">{{ (props.row as unknown as EmployeeInfo).name }}</strong>
          <span class="emp-email">{{ (props.row as unknown as EmployeeInfo).email }}</span>
        </div>
      </div>
    </template>

    <template #body-cell-role="props">
      <div
        class="role-chip"
        :class="getRoleThemeClass((props.row as unknown as EmployeeInfo).role)"
      >
        <q-icon :name="getRoleIcon((props.row as unknown as EmployeeInfo).role)" size="14px" />
        <span>{{ (props.row as unknown as EmployeeInfo).role }}</span>
      </div>
    </template>

    <template #body-cell-phone="props">
      <div class="phone-cell">
        <q-icon name="call" size="14px" />
        <span>{{ (props.row as unknown as EmployeeInfo).phone }}</span>
      </div>
    </template>

    <template #body-cell-status="props">
      <div
        class="status-glow-pill"
        :class="{
          active: (props.row as unknown as EmployeeInfo).isOnDuty,
          'off-duty': !(props.row as unknown as EmployeeInfo).isOnDuty,
        }"
      >
        <span class="glow-dot"></span>
        <span>{{
          (props.row as unknown as EmployeeInfo).isOnDuty
            ? t('staff.status.onDuty')
            : t('staff.status.offDuty')
        }}</span>
      </div>
    </template>

    <template #body-cell-shiftInfo="props">
      <div class="shift-cell">
        <q-icon name="schedule" size="14px" />
        <span>{{ (props.row as unknown as EmployeeInfo).shiftInfo }}</span>
      </div>
    </template>

    <template #body-cell-actions="props">
      <div class="actions-cell">
        <button
          type="button"
          class="action-btn edit-btn"
          title="แก้ไขข้อมูล"
          @click="$emit('edit', props.row as unknown as EmployeeInfo)"
        >
          <q-icon name="edit_note" size="18px" />
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
import type { EmployeeInfo } from './employee-card.vue';

const { t } = useI18n();

defineProps<{
  items: EmployeeInfo[];
}>();

defineEmits<{
  (e: 'edit', item: EmployeeInfo): void;
}>();

const sortString = (a: unknown, b: unknown): number => {
  const strA = typeof a === 'string' || typeof a === 'number' ? String(a) : '';
  const strB = typeof b === 'string' || typeof b === 'number' ? String(b) : '';
  return strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
};

const getRoleThemeClass = (role: string): string => {
  const r = role.toLowerCase();
  if (r.includes('manager') || r.includes('supervisor')) return 'role-theme-purple';
  if (r.includes('barista')) return 'role-theme-amber';
  if (r.includes('chef')) return 'role-theme-pink';
  if (r.includes('cashier')) return 'role-theme-teal';
  return 'role-theme-blue';
};

const getAvatarTheme = (role: string): string => {
  const r = role.toLowerCase();
  if (r.includes('manager') || r.includes('supervisor')) return 'avatar-purple';
  if (r.includes('barista')) return 'avatar-amber';
  if (r.includes('chef')) return 'avatar-pink';
  if (r.includes('cashier')) return 'avatar-teal';
  return 'avatar-blue';
};

const getRoleIcon = (role: string): string => {
  const r = role.toLowerCase();
  if (r.includes('manager') || r.includes('supervisor')) return 'verified_user';
  if (r.includes('barista')) return 'local_cafe';
  if (r.includes('chef')) return 'bakery_dining';
  if (r.includes('cashier')) return 'point_of_sale';
  return 'badge';
};

const columns = computed<QTableColumn<Record<string, unknown>>[]>(
  () =>
    [
      {
        name: 'employeeId',
        label: t('staff.table.employeeId'),
        field: 'employeeId',
        align: 'left',
        sortable: true,
        sort: (a: unknown, b: unknown) => sortString(a, b),
      },
      {
        name: 'name',
        label: t('staff.table.name'),
        field: 'name',
        align: 'left',
        sortable: true,
        sort: (a: unknown, b: unknown) => sortString(a, b),
      },
      {
        name: 'role',
        label: t('staff.table.role'),
        field: 'role',
        align: 'left',
        sortable: true,
        sort: (a: unknown, b: unknown) => sortString(a, b),
      },
      {
        name: 'phone',
        label: t('staff.table.phone'),
        field: 'phone',
        align: 'left',
        sortable: true,
        sort: (a: unknown, b: unknown) => sortString(a, b),
      },
      {
        name: 'shiftInfo',
        label: t('staff.table.shiftInfo'),
        field: 'shiftInfo',
        align: 'left',
        sortable: true,
        sort: (a: unknown, b: unknown) => sortString(a, b),
      },
      {
        name: 'status',
        label: t('staff.table.status'),
        field: 'isOnDuty',
        align: 'center',
        sortable: true,
        sort: (a: unknown, b: unknown) => Number(Boolean(a)) - Number(Boolean(b)),
      },
      {
        name: 'actions',
        label: t('staff.table.actions'),
        field: 'employeeId',
        align: 'center',
        sortable: false,
      },
    ] as unknown as QTableColumn<Record<string, unknown>>[],
);
</script>

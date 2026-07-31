<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="app-dialog-card employee-form-dialog-card">
      <AppDialogHeader
        :title="
          isEditing
            ? t('employee.editEmployeeTitle', {
                name: `${employee?.firstName || ''} ${employee?.lastName || ''}`,
              })
            : t('employee.addEmployeeTitle')
        "
        :subtitle="t('employee.employeeFormSubtitle')"
        icon="badge"
      />

      <main class="dialog-body">
        <form class="employee-form" @submit.prevent="onSave">
          <div class="form-row-2col">
            <AppFormField :label="t('auth.firstNameLabel')">
              <q-input
                v-model="form.firstName"
                outlined
                dense
                class="custom-input"
                :rules="[(val) => !!val || t('common.required')]"
              />
            </AppFormField>

            <AppFormField :label="t('auth.lastNameLabel')">
              <q-input v-model="form.lastName" outlined dense class="custom-input" />
            </AppFormField>
          </div>

          <div class="form-row-2col">
            <AppFormField :label="t('employee.role')">
              <q-select
                v-model="form.role"
                :options="roleOptions"
                outlined
                dense
                options-dense
                class="custom-select"
              />
            </AppFormField>

            <AppFormField :label="t('employee.branch')">
              <q-select
                v-model="form.branch"
                :options="branchOptions"
                outlined
                dense
                options-dense
                class="custom-select"
              />
            </AppFormField>
          </div>

          <div class="form-row-2col">
            <AppFormField :label="t('auth.phoneLabel')">
              <q-input
                v-model="form.phone"
                outlined
                dense
                class="custom-input"
                placeholder="08x-xxx-xxxx"
              >
                <template #prepend>
                  <q-icon name="phone" size="18px" class="prefix-icon" />
                </template>
              </q-input>
            </AppFormField>

            <AppFormField :label="t('auth.emailLabel')">
              <q-input v-model="form.email" outlined dense class="custom-input">
                <template #prepend>
                  <q-icon name="email" size="18px" class="prefix-icon" />
                </template>
              </q-input>
            </AppFormField>
          </div>

          <div class="form-row-2col">
            <AppFormField :label="t('employee.salary')">
              <q-input
                v-model.number="form.salary"
                type="number"
                outlined
                dense
                class="custom-input"
                prefix="฿"
                step="500"
              />
            </AppFormField>

            <AppFormField :label="t('employee.status')">
              <q-select
                v-model="form.status"
                :options="statusOptions"
                outlined
                dense
                emit-value
                map-options
                options-dense
                class="custom-select"
              />
            </AppFormField>
          </div>
        </form>
      </main>

      <footer class="dialog-actions">
        <button v-close-popup type="button" class="btn-cancel">
          {{ t('common.cancel') }}
        </button>

        <GradientButton
          :label="isEditing ? t('common.save') : t('common.add')"
          icon="check"
          variant="primary"
          @click="onSave"
        />
      </footer>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { EmployeeItem } from '@/stores/employee-store';
import AppDialogHeader from '@/components/base/app-dialog-header.vue';
import AppFormField from '@/components/base/app-form-field.vue';
import GradientButton from '@/components/base/gradient-button.vue';

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  employee?: EmployeeItem | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'save', payload: Omit<EmployeeItem, 'id' | 'code'> | Partial<EmployeeItem>): void;
}>();

const isEditing = computed(() => !!props.employee);

const roleOptions = [
  'ผู้จัดการสาขา (Branch Manager)',
  'พนักงานแคชเชียร์ (Head Cashier)',
  'หัวหน้าห้องครัว (Executive Chef)',
  'พนักงานบริการ (Barista / Service)',
  'พนักงานคลังสินค้า (Stock Supervisor)',
];

const branchOptions = ['สาขาหลัก (Main Branch)', 'สาขา 2 (Central Mall)', 'สาขา 3 (Mega Bangna)'];

const statusOptions = computed(() => [
  { label: t('common.active'), value: 'active' },
  { label: t('common.inactive'), value: 'inactive' },
]);

const form = ref<{
  firstName: string;
  lastName: string;
  role: string;
  branch: string;
  phone: string;
  email: string;
  salary: number;
  startDate: string;
  status: 'active' | 'inactive';
}>({
  firstName: '',
  lastName: '',
  role: 'พนักงานแคชเชียร์ (Head Cashier)',
  branch: 'สาขาหลัก (Main Branch)',
  phone: '',
  email: '',
  salary: 20000,
  startDate: new Date().toISOString().slice(0, 10),
  status: 'active',
});

watch(
  () => [props.employee, props.modelValue],
  ([emp, isOpen]) => {
    if (isOpen) {
      if (emp) {
        const e = emp as EmployeeItem;
        form.value = {
          firstName: e.firstName,
          lastName: e.lastName,
          role: e.role,
          branch: e.branch,
          phone: e.phone,
          email: e.email,
          salary: e.salary,
          startDate: e.startDate,
          status: e.status,
        };
      } else {
        form.value = {
          firstName: '',
          lastName: '',
          role: 'พนักงานแคชเชียร์ (Head Cashier)',
          branch: 'สาขาหลัก (Main Branch)',
          phone: '',
          email: '',
          salary: 20000,
          startDate: new Date().toISOString().slice(0, 10),
          status: 'active',
        };
      }
    }
  },
  { immediate: true },
);

const onSave = (): void => {
  if (!form.value.firstName.trim()) return;
  emit('save', {
    ...form.value,
    firstName: form.value.firstName.trim(),
    lastName: form.value.lastName.trim(),
  });
  emit('update:modelValue', false);
};
</script>

<style lang="scss">
@use '../../css/variables' as *;

.employee-form-dialog-card {
  width: 520px;
  max-width: 95vw;

  .employee-form {
    display: flex;
    flex-direction: column;
    gap: 14px;

    .form-row-2col {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }
}
</style>

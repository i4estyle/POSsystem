<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="app-dialog-card salary-form-dialog-card">
      <AppDialogHeader
        :title="
          isEditing
            ? t('salary.editRecordTitle', { name: record?.employeeName || '' })
            : t('salary.addRecordTitle')
        "
        :subtitle="t('salary.recordFormSubtitle')"
        icon="payments"
      />

      <main class="dialog-body">
        <form class="salary-form" @submit.prevent="onSave">
          <AppFormField :label="t('salary.employee')">
            <q-input
              v-model="form.employeeName"
              outlined
              dense
              class="custom-input"
              :placeholder="t('salary.employeePlaceholder')"
            >
              <template #prepend>
                <q-icon name="person" size="18px" class="prefix-icon" />
              </template>
            </q-input>
          </AppFormField>

          <div class="form-row-2col">
            <AppFormField :label="t('salary.role')">
              <q-input v-model="form.role" outlined dense class="custom-input" />
            </AppFormField>

            <AppFormField :label="t('salary.month')">
              <q-input
                v-model="form.month"
                outlined
                dense
                class="custom-input"
                placeholder="YYYY-MM"
              />
            </AppFormField>
          </div>

          <div class="form-row-2col">
            <AppFormField :label="t('salary.baseSalary')">
              <q-input
                v-model.number="form.baseSalary"
                type="number"
                outlined
                dense
                class="custom-input"
                prefix="฿"
                step="500"
              />
            </AppFormField>

            <AppFormField :label="t('salary.overtimePay')">
              <q-input
                v-model.number="form.overtimePay"
                type="number"
                outlined
                dense
                class="custom-input"
                prefix="฿"
                step="100"
              />
            </AppFormField>
          </div>

          <div class="form-row-2col">
            <AppFormField :label="t('salary.bonus')">
              <q-input
                v-model.number="form.bonus"
                type="number"
                outlined
                dense
                class="custom-input"
                prefix="฿"
                step="100"
              />
            </AppFormField>

            <AppFormField :label="t('salary.deduction')">
              <q-input
                v-model.number="form.deduction"
                type="number"
                outlined
                dense
                class="custom-input"
                prefix="฿"
                step="50"
              />
            </AppFormField>
          </div>

          <div class="net-preview-box">
            <span>{{ t('salary.totalNet') }}:</span>
            <strong>฿{{ calculatedNet.toLocaleString() }}</strong>
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
import type { SalaryRecord } from '@/stores/salary-store';
import AppDialogHeader from '@/components/base/app-dialog-header.vue';
import AppFormField from '@/components/base/app-form-field.vue';
import GradientButton from '@/components/base/gradient-button.vue';

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  record?: SalaryRecord | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'save', payload: Omit<SalaryRecord, 'id' | 'totalNet'> | Partial<SalaryRecord>): void;
}>();

const isEditing = computed(() => !!props.record);

const form = ref<{
  employeeId: number;
  employeeName: string;
  role: string;
  month: string;
  baseSalary: number;
  overtimePay: number;
  bonus: number;
  deduction: number;
  paymentStatus: 'paid' | 'pending';
}>({
  employeeId: 1,
  employeeName: '',
  role: 'พนักงานบริการ',
  month: '2026-07',
  baseSalary: 20000,
  overtimePay: 1500,
  bonus: 1000,
  deduction: 400,
  paymentStatus: 'pending',
});

const calculatedNet = computed(() =>
  Math.max(
    0,
    form.value.baseSalary + form.value.overtimePay + form.value.bonus - form.value.deduction,
  ),
);

watch(
  () => [props.record, props.modelValue],
  ([rec, isOpen]) => {
    if (isOpen) {
      if (rec) {
        const r = rec as SalaryRecord;
        form.value = {
          employeeId: r.employeeId,
          employeeName: r.employeeName,
          role: r.role,
          month: r.month,
          baseSalary: r.baseSalary,
          overtimePay: r.overtimePay,
          bonus: r.bonus,
          deduction: r.deduction,
          paymentStatus: r.paymentStatus,
        };
      } else {
        form.value = {
          employeeId: 1,
          employeeName: '',
          role: 'พนักงานบริการ',
          month: '2026-07',
          baseSalary: 20000,
          overtimePay: 1500,
          bonus: 1000,
          deduction: 400,
          paymentStatus: 'pending',
        };
      }
    }
  },
  { immediate: true },
);

const onSave = (): void => {
  if (!form.value.employeeName.trim()) return;
  emit('save', { ...form.value, employeeName: form.value.employeeName.trim() });
  emit('update:modelValue', false);
};
</script>

<style lang="scss">
@use '../../css/variables' as *;

.salary-form-dialog-card {
  width: 500px;
  max-width: 95vw;

  .salary-form {
    display: flex;
    flex-direction: column;
    gap: 14px;

    .form-row-2col {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .net-preview-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-radius: $radius-lg;
      background: linear-gradient(
        135deg,
        rgba(99, 88, 128, 0.08) 0%,
        rgba(59, 130, 246, 0.08) 100%
      );
      border: 1px solid rgba(208, 195, 241, 0.5);

      span {
        font: 700 13px $font-family-base;
        color: $color-text-main;
      }

      strong {
        font: 800 18px $font-family-base;
        color: $color-primary-dark;
      }
    }
  }
}
</style>

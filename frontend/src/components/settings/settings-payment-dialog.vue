<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="app-dialog-card" style="width: 400px; max-width: 95vw">
      <AppDialogHeader :title="t('settings.paymentTax.methods.addMethodTitle')" icon="payments" />

      <main class="dialog-body">
        <AppFormField :label="t('settings.paymentTax.methods.methodName')">
          <q-input
            v-model="methodName"
            outlined
            dense
            class="custom-input"
            :placeholder="t('settings.paymentTax.methods.methodNamePlaceholder')"
            @keyup.enter="onConfirm"
          />
        </AppFormField>
      </main>

      <footer class="dialog-actions">
        <button v-close-popup type="button" class="btn-cancel">
          {{ t('settings.hardware.printerDialog.cancel') }}
        </button>

        <GradientButton
          :label="t('settings.paymentTax.methods.addMethod')"
          icon="add"
          variant="primary"
          :disabled="!methodName.trim()"
          @click="onConfirm"
        />
      </footer>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppDialogHeader from '@/components/base/app-dialog-header.vue';
import AppFormField from '@/components/base/app-form-field.vue';
import GradientButton from '@/components/base/gradient-button.vue';

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'confirm', name: string): void;
}>();

const methodName = ref('');

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      methodName.value = '';
    }
  },
);

const onConfirm = (): void => {
  if (!methodName.value.trim()) return;
  emit('confirm', methodName.value.trim());
  emit('update:modelValue', false);
};
</script>

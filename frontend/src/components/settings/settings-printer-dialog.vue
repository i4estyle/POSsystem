<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="app-dialog-card settings-printer-dialog-card">
      <AppDialogHeader
        :title="
          isEditing
            ? t('settings.hardware.printerDialog.editTitle')
            : t('settings.hardware.printerDialog.addTitle')
        "
        :subtitle="t('settings.hardware.printerDialog.subtitle')"
        icon="print"
      />

      <main class="dialog-body">
        <form class="printer-form" @submit.prevent="onSave">
          <AppFormField :label="t('settings.hardware.printerDialog.printerName')">
            <q-input
              v-model="form.name"
              outlined
              dense
              class="custom-input"
              :placeholder="t('settings.hardware.printerDialog.printerNamePlaceholder')"
            >
              <template #prepend>
                <q-icon name="subtitles" size="18px" class="prefix-icon" />
              </template>
            </q-input>
          </AppFormField>

          <div class="form-row-2col">
            <AppFormField :label="t('settings.hardware.printerDialog.type')">
              <q-select
                v-model="form.type"
                :options="printerTypes"
                outlined
                dense
                options-dense
                class="custom-select"
              >
                <template #prepend>
                  <q-icon name="lan" size="18px" class="prefix-icon" />
                </template>
              </q-select>
            </AppFormField>

            <AppFormField :label="t('settings.hardware.printerDialog.paperWidth')">
              <q-select
                v-model="form.paperWidth"
                :options="paperWidths"
                outlined
                dense
                options-dense
                class="custom-select"
              >
                <template #prepend>
                  <q-icon name="content_cut" size="18px" class="prefix-icon" />
                </template>
              </q-select>
            </AppFormField>
          </div>

          <AppFormField :label="t('settings.hardware.printerDialog.ipAddress')">
            <q-input
              v-model="form.ipAddress"
              outlined
              dense
              class="custom-input"
              :placeholder="t('settings.hardware.printerDialog.ipPlaceholder')"
            >
              <template #prepend>
                <q-icon name="dns" size="18px" class="prefix-icon" />
              </template>
            </q-input>
          </AppFormField>

          <div class="toggles-grid">
            <div class="toggle-box">
              <q-toggle v-model="form.autoCut" color="primary" dense />
              <span>{{ t('settings.hardware.printerDialog.autoCut') }}</span>
            </div>

            <div class="toggle-box">
              <q-toggle v-model="form.printLogo" color="primary" dense />
              <span>{{ t('settings.hardware.printerDialog.printLogo') }}</span>
            </div>
          </div>
        </form>
      </main>

      <footer class="dialog-actions">
        <button v-close-popup type="button" class="btn-cancel">
          {{ t('settings.hardware.printerDialog.cancel') }}
        </button>

        <GradientButton
          :label="t('settings.hardware.printerDialog.save')"
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
import type { PrinterConfig } from '@/types/settings';
import AppDialogHeader from '@/components/base/app-dialog-header.vue';
import AppFormField from '@/components/base/app-form-field.vue';
import GradientButton from '@/components/base/gradient-button.vue';

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  printer?: PrinterConfig | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'save', data: Omit<PrinterConfig, 'id'>): void;
}>();

const isEditing = computed(() => !!props.printer);
const printerTypes = ['Network (LAN/IP)', 'Bluetooth', 'USB Direct'];
const paperWidths = ['80 mm', '58 mm'];

const form = ref({
  name: '',
  type: 'Network (LAN/IP)',
  ipAddress: '192.168.1.200',
  paperWidth: '80 mm',
  autoCut: true,
  printLogo: true,
  isDefault: false,
});

watch(
  () => [props.printer, props.modelValue],
  ([newPrinter, isOpen]) => {
    if (isOpen) {
      if (newPrinter) {
        const p = newPrinter as PrinterConfig;
        form.value = {
          name: p.name,
          type: p.type,
          ipAddress: p.ipAddress,
          paperWidth: p.paperWidth,
          autoCut: p.autoCut,
          printLogo: p.printLogo,
          isDefault: p.isDefault,
        };
      } else {
        form.value = {
          name: '',
          type: 'Network (LAN/IP)',
          ipAddress: '192.168.1.200',
          paperWidth: '80 mm',
          autoCut: true,
          printLogo: true,
          isDefault: false,
        };
      }
    }
  },
  { immediate: true },
);

const onSave = (): void => {
  if (!form.value.name.trim()) return;
  emit('save', { ...form.value, name: form.value.name.trim() });
  emit('update:modelValue', false);
};
</script>

<style lang="scss">
@use '../../css/variables' as *;

.settings-printer-dialog-card {
  width: 460px;
  max-width: 95vw;

  .printer-form {
    display: flex;
    flex-direction: column;
    gap: 14px;

    .form-row-2col {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .toggles-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      background: rgba(253, 248, 252, 0.6);
      padding: 12px;
      border-radius: $radius-lg;
      border: 1px solid rgba(208, 195, 241, 0.4);

      .toggle-box {
        display: flex;
        align-items: center;
        gap: 8px;
        font: 600 12.5px $font-family-base;
        color: $color-text-main;
      }
    }
  }
}
</style>

<template>
  <q-dialog
    :model-value="modelValue"
    :persistent="persistent"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="app-base-dialog-card" :style="{ width: width, maxWidth: maxWidth }">
      <header class="dialog-header">
        <div class="dialog-title-group">
          <div v-if="icon" class="header-icon-badge">
            <q-icon :name="icon" size="22px" />
          </div>
          <div>
            <h2 v-if="title" class="dialog-title">{{ title }}</h2>
            <small v-if="subtitle" class="dialog-subtitle">{{ subtitle }}</small>
            <slot name="title-extra" />
          </div>
        </div>
        <q-btn v-close-popup flat round icon="close" size="md" class="close-btn" />
      </header>

      <main class="dialog-body">
        <slot />
      </main>

      <footer v-if="showActions || $slots.actions" class="dialog-actions">
        <slot name="actions">
          <button
            v-if="showCancel"
            v-close-popup
            type="button"
            class="btn-cancel"
            @click="emit('cancel')"
          >
            {{ cancelLabel || t('common.cancel') }}
          </button>

          <GradientButton
            v-if="showSubmit"
            :label="submitLabel || t('common.save')"
            :icon="submitIcon"
            :variant="submitVariant"
            :disabled="submitDisabled || loading"
            @click="emit('submit')"
          />
        </slot>
      </footer>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import GradientButton from '@/components/base/gradient-button.vue';

const { t } = useI18n();

withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    subtitle?: string;
    icon?: string;
    width?: string;
    maxWidth?: string;
    persistent?: boolean;
    showActions?: boolean;
    showCancel?: boolean;
    showSubmit?: boolean;
    cancelLabel?: string;
    submitLabel?: string;
    submitIcon?: string;
    submitVariant?: 'primary' | 'secondary' | 'accent';
    submitDisabled?: boolean;
    loading?: boolean;
  }>(),
  {
    title: '',
    subtitle: '',
    icon: '',
    width: '460px',
    maxWidth: '95vw',
    persistent: true,
    showActions: true,
    showCancel: true,
    showSubmit: true,
    cancelLabel: '',
    submitLabel: '',
    submitIcon: 'check',
    submitVariant: 'primary',
    submitDisabled: false,
    loading: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'cancel'): void;
  (e: 'submit'): void;
}>();
</script>

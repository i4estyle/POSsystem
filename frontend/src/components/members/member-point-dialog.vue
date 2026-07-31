<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="app-dialog-card member-point-dialog-card">
      <AppDialogHeader
        :title="t('members.adjustPointsTitle', { name: member?.name || '' })"
        :subtitle="t('members.currentPointsLabel', { points: member?.points || 0 })"
        icon="stars"
      />

      <main class="dialog-body">
        <form class="point-form" @submit.prevent="onConfirm">
          <div class="action-type-toggle">
            <button
              type="button"
              :class="['toggle-btn', { active: actionType === 'add' }]"
              @click="actionType = 'add'"
            >
              <q-icon name="add_circle" size="18px" />
              <span>{{ t('members.addPoints') }}</span>
            </button>
            <button
              type="button"
              :class="['toggle-btn', { active: actionType === 'deduct' }]"
              @click="actionType = 'deduct'"
            >
              <q-icon name="remove_circle" size="18px" />
              <span>{{ t('members.deductPoints') }}</span>
            </button>
          </div>

          <AppFormField :label="t('members.pointsAmount')">
            <q-input
              v-model.number="amount"
              type="number"
              outlined
              dense
              class="custom-input"
              min="1"
              step="10"
            >
              <template #prepend>
                <q-icon name="stars" size="18px" class="prefix-icon" />
              </template>
            </q-input>
          </AppFormField>
        </form>
      </main>

      <footer class="dialog-actions">
        <button v-close-popup type="button" class="btn-cancel">
          {{ t('common.cancel') }}
        </button>

        <GradientButton
          :label="t('common.confirm')"
          icon="check"
          variant="primary"
          :disabled="amount <= 0"
          @click="onConfirm"
        />
      </footer>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MemberItem } from '@/stores/member-store';
import AppDialogHeader from '@/components/base/app-dialog-header.vue';
import AppFormField from '@/components/base/app-form-field.vue';
import GradientButton from '@/components/base/gradient-button.vue';

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  member?: MemberItem | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'confirm', delta: number): void;
}>();

const actionType = ref<'add' | 'deduct'>('add');
const amount = ref<number>(100);

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      actionType.value = 'add';
      amount.value = 100;
    }
  },
);

const onConfirm = (): void => {
  if (amount.value <= 0) return;
  const delta = actionType.value === 'add' ? amount.value : -amount.value;
  emit('confirm', delta);
  emit('update:modelValue', false);
};
</script>

<style lang="scss">
@use '../../css/variables' as *;

.member-point-dialog-card {
  width: 420px;
  max-width: 95vw;

  .point-form {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .action-type-toggle {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      background: #f4f4f5;
      padding: 4px;
      border-radius: $radius-lg;

      .toggle-btn {
        height: 38px;
        border-radius: $radius-md;
        border: none;
        background: transparent;
        color: $color-text-muted;
        font: 700 13px $font-family-base;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        cursor: pointer;
        transition: all 0.2s ease;

        &.active {
          background: #ffffff;
          color: $color-primary-dark;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
      }
    }
  }
}
</style>

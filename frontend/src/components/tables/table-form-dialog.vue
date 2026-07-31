<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="app-dialog-card table-form-dialog-card">
      <AppDialogHeader
        :title="
          isConfirmingDelete
            ? t('tables.form.confirmDeleteTitle')
            : isEditing
              ? t('tables.form.titleEdit', { number: table?.tableNumber })
              : t('tables.form.titleCreate')
        "
        :subtitle="
          isConfirmingDelete
            ? t('tables.form.confirmDeleteSubtitle')
            : isEditing
              ? t('tables.editTable', { number: table?.tableNumber })
              : t('tables.subtitle')
        "
        :icon="isConfirmingDelete ? 'warning' : 'table_restaurant'"
      />

      <main class="dialog-body">
        <Transition name="fade-slide" mode="out-in">
          <div v-if="!isConfirmingDelete" key="form-view" class="form-container">
            <form class="table-form" @submit.prevent="onSave">
              <AppFormField :label="t('tables.form.tableNumberLabel')">
                <q-input
                  v-model="form.tableNumber"
                  outlined
                  dense
                  class="custom-input"
                  :placeholder="t('tables.form.tableNumberPlaceholder')"
                  :rules="[(val) => !!val || t('tables.form.tableNumberLabel')]"
                >
                  <template #prepend>
                    <q-icon name="grid_3x3" size="18px" class="prefix-icon" />
                  </template>
                </q-input>
              </AppFormField>

              <AppFormField :label="t('tables.form.capacityLabel')">
                <q-input
                  v-model.number="form.capacity"
                  type="number"
                  outlined
                  dense
                  class="custom-input"
                  min="1"
                  max="50"
                >
                  <template #prepend>
                    <q-icon name="group" size="18px" class="prefix-icon" />
                  </template>
                </q-input>
              </AppFormField>

              <AppFormField :label="t('tables.form.statusLabel')">
                <q-select
                  v-model="form.status"
                  outlined
                  dense
                  emit-value
                  map-options
                  class="custom-select"
                  :options="statusOptions"
                >
                  <template #prepend>
                    <span :class="['status-icon-dot', form.status]"></span>
                  </template>
                  <template #option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar class="min-avatar">
                        <span :class="['option-status-dot', scope.opt.value]"></span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </AppFormField>
            </form>
          </div>

          <div v-else key="delete-view" class="delete-confirm-view">
            <div class="delete-warning-box">
              <div class="warning-icon-wrapper">
                <q-icon name="warning_amber" size="36px" />
              </div>
              <h3>{{ t('tables.form.confirmDelete', { number: table?.tableNumber }) }}</h3>
              <p>{{ t('tables.form.confirmDeleteDesc') }}</p>
            </div>
          </div>
        </Transition>
      </main>

      <footer
        class="dialog-actions"
        :class="{ 'space-between-actions': isEditing && !isConfirmingDelete }"
      >
        <template v-if="!isConfirmingDelete">
          <button
            v-if="isEditing"
            type="button"
            class="btn-delete"
            @click="isConfirmingDelete = true"
          >
            <q-icon name="delete_outline" size="16px" />
            <span>{{ t('tables.form.deleteBtn') }}</span>
          </button>

          <div class="right-actions">
            <button v-close-popup type="button" class="btn-cancel">
              {{ t('tables.form.cancelBtn') }}
            </button>
            <GradientButton
              :label="t('tables.form.saveBtn')"
              icon="check"
              variant="primary"
              @click="onSave"
            />
          </div>
        </template>

        <template v-else>
          <button type="button" class="btn-cancel" @click="isConfirmingDelete = false">
            {{ t('tables.form.cancelBtn') }}
          </button>

          <GradientButton
            :label="t('tables.form.confirmDeleteBtn')"
            icon="delete"
            variant="accent"
            @click="confirmDelete"
          />
        </template>
      </footer>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TableManagementItem, TableStatus } from '@/types/dining-table';
import AppDialogHeader from '@/components/base/app-dialog-header.vue';
import AppFormField from '@/components/base/app-form-field.vue';
import GradientButton from '@/components/base/gradient-button.vue';

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  table: TableManagementItem | null;
}>();

interface Emits {
  (e: 'update:modelValue', val: boolean): void;
  (e: 'save', tableData: Partial<TableManagementItem>): void;
  (e: 'delete', tableId: number): void;
}

const emit = defineEmits<Emits>();

const isEditing = computed(() => !!props.table);
const isConfirmingDelete = ref(false);

const form = ref<{
  tableNumber: string;
  capacity: number;
  status: TableStatus;
}>({
  tableNumber: '',
  capacity: 4,
  status: 'available',
});

watch(
  () => [props.table, props.modelValue],
  ([newTable, isOpen]) => {
    if (isOpen) {
      isConfirmingDelete.value = false;
    }
    if (newTable) {
      form.value = {
        tableNumber: (newTable as TableManagementItem).tableNumber,
        capacity: (newTable as TableManagementItem).capacity,
        status: (newTable as TableManagementItem).status,
      };
    } else {
      form.value = {
        tableNumber: '',
        capacity: 4,
        status: 'available',
      };
    }
  },
  { immediate: true },
);

const statusOptions = computed(() => [
  { label: t('tables.status.available'), value: 'available' },
  { label: t('tables.status.occupied'), value: 'occupied' },
  { label: t('tables.status.cleaning'), value: 'cleaning' },
  { label: t('tables.status.reserved'), value: 'reserved' },
]);

const onSave = (): void => {
  if (!form.value.tableNumber.trim()) return;

  const tableData: Partial<TableManagementItem> = {
    tableNumber: form.value.tableNumber.trim(),
    capacity: form.value.capacity,
    status: form.value.status,
  };

  emit('save', tableData);
  emit('update:modelValue', false);
};

const confirmDelete = (): void => {
  if (props.table) {
    emit('delete', props.table.tableId);
    emit('update:modelValue', false);
    isConfirmingDelete.value = false;
  }
};
</script>

<style lang="scss">
@use '../../css/variables' as *;

.table-form-dialog-card {
  width: 440px;
  max-width: 95vw;

  .table-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .delete-confirm-view {
    .delete-warning-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 12px;

      .warning-icon-wrapper {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #fef2f2;
        color: #dc2626;
        display: grid;
        place-items: center;
        margin-bottom: 12px;
      }

      h3 {
        margin: 0 0 6px;
        font: 700 16px $font-family-base;
        color: $color-text-main;
      }

      p {
        margin: 0;
        font: 13px/18px $font-family-base;
        color: $color-text-muted;
      }
    }
  }

  .status-icon-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;

    &.available {
      background: #22c55e;
    }
    &.occupied {
      background: #ef4444;
    }
    &.cleaning {
      background: #f59e0b;
    }
    &.reserved {
      background: #a855f7;
    }
  }

  .option-status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;

    &.available {
      background: #22c55e;
    }
    &.occupied {
      background: #ef4444;
    }
    &.cleaning {
      background: #f59e0b;
    }
    &.reserved {
      background: #a855f7;
    }
  }

  .min-avatar {
    min-width: 24px;
  }
}
</style>

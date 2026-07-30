<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="table-form-card">
      <header class="dialog-header">
        <div>
          <h2 class="dialog-title">
            {{
              isConfirmingDelete
                ? t('tables.form.confirmDeleteTitle')
                : isEditing
                  ? t('tables.form.titleEdit', { number: table?.tableNumber })
                  : t('tables.form.titleCreate')
            }}
          </h2>
          <small class="dialog-subtitle">
            {{
              isConfirmingDelete
                ? t('tables.form.confirmDeleteSubtitle')
                : isEditing
                  ? t('tables.editTable', { number: table?.tableNumber })
                  : t('tables.subtitle')
            }}
          </small>
        </div>
        <q-btn v-close-popup flat round icon="close" size="md" class="close-btn" />
      </header>

      <Transition name="fade-slide" mode="out-in">
        <main v-if="!isConfirmingDelete" key="form-view" class="dialog-body">
          <form class="table-form" @submit.prevent="onSave">
            <div class="form-group">
              <label class="field-label">{{ t('tables.form.tableNumberLabel') }}</label>
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
            </div>

            <div class="form-group">
              <label class="field-label">{{ t('tables.form.capacityLabel') }}</label>
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
            </div>

            <div class="form-group">
              <label class="field-label">{{ t('tables.form.statusLabel') }}</label>
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
            </div>
          </form>
        </main>

        <main v-else key="delete-view" class="dialog-body delete-confirm-view">
          <div class="delete-warning-box">
            <div class="warning-icon-wrapper">
              <q-icon name="warning_amber" size="36px" />
            </div>
            <h3>{{ t('tables.form.confirmDelete', { number: table?.tableNumber }) }}</h3>
            <p>{{ t('tables.form.confirmDeleteDesc') }}</p>
          </div>
        </main>
      </Transition>

      <footer class="dialog-actions">
        <template v-if="!isConfirmingDelete">
          <button
            v-if="isEditing"
            type="button"
            class="form-btn btn-delete"
            @click="isConfirmingDelete = true"
          >
            {{ t('tables.form.deleteBtn') }}
          </button>

          <div class="right-actions">
            <button v-close-popup type="button" class="form-btn btn-cancel">
              {{ t('tables.form.cancelBtn') }}
            </button>
            <button type="button" class="form-btn btn-save" @click="onSave">
              {{ t('tables.form.saveBtn') }}
            </button>
          </div>
        </template>

        <template v-else>
          <button type="button" class="form-btn btn-cancel" @click="isConfirmingDelete = false">
            {{ t('tables.form.cancelBtn') }}
          </button>

          <button type="button" class="form-btn btn-delete-confirm" @click="confirmDelete">
            {{ t('tables.form.confirmDeleteBtn') }}
          </button>
        </template>
      </footer>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TableManagementItem, TableStatus } from '@/types/dining-table';

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

<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="app-dialog-card stock-form-dialog-card">
      <AppDialogHeader
        :title="
          isEditing
            ? t('stock.editStockTitle', { name: item?.name || '' })
            : t('stock.addStockTitle')
        "
        :subtitle="t('stock.stockFormSubtitle')"
        icon="inventory_2"
      />

      <main class="dialog-body">
        <form class="stock-form" @submit.prevent="onSave">
          <AppFormField :label="t('stock.itemName')">
            <q-input
              v-model="form.name"
              outlined
              dense
              class="custom-input"
              :placeholder="t('stock.itemNamePlaceholder')"
            >
              <template #prepend>
                <q-icon name="shopping_bag" size="18px" class="prefix-icon" />
              </template>
            </q-input>
          </AppFormField>

          <div class="form-row-2col">
            <AppFormField :label="t('stock.category')">
              <q-select
                v-model="form.category"
                :options="categoryOptions"
                outlined
                dense
                options-dense
                class="custom-select"
              />
            </AppFormField>

            <AppFormField :label="t('stock.code')">
              <q-input
                v-model="form.code"
                outlined
                dense
                class="custom-input"
                placeholder="RAW-001"
              />
            </AppFormField>
          </div>

          <div class="form-row-2col">
            <AppFormField :label="t('stock.quantity')">
              <q-input
                v-model.number="form.quantity"
                type="number"
                outlined
                dense
                class="custom-input"
                min="0"
              />
            </AppFormField>

            <AppFormField :label="t('stock.unit')">
              <q-select
                v-model="form.unit"
                :options="unitOptions"
                outlined
                dense
                options-dense
                class="custom-select"
              />
            </AppFormField>
          </div>

          <div class="form-row-2col">
            <AppFormField :label="t('stock.minLevel')">
              <q-input
                v-model.number="form.minLevel"
                type="number"
                outlined
                dense
                class="custom-input"
                min="1"
              />
            </AppFormField>

            <AppFormField :label="t('stock.costPrice')">
              <q-input
                v-model.number="form.costPrice"
                type="number"
                outlined
                dense
                class="custom-input"
                prefix="฿"
                min="0"
              />
            </AppFormField>
          </div>

          <AppFormField :label="t('stock.supplier')">
            <q-input
              v-model="form.supplier"
              outlined
              dense
              class="custom-input"
              placeholder="Supplier Name"
            >
              <template #prepend>
                <q-icon name="local_shipping" size="18px" class="prefix-icon" />
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
import type { StockItem } from '@/stores/stock-store';
import AppDialogHeader from '@/components/base/app-dialog-header.vue';
import AppFormField from '@/components/base/app-form-field.vue';
import GradientButton from '@/components/base/gradient-button.vue';

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  item?: StockItem | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'save', payload: Omit<StockItem, 'id' | 'lastUpdated' | 'status'> | Partial<StockItem>): void;
}>();

const isEditing = computed(() => !!props.item);

const categoryOptions = [
  'วัตถุดิบสด',
  'วัตถุดิบเครื่องดื่ม',
  'ของแห้ง/แช่แข็ง',
  'ผลไม้สด',
  'เครื่องปรุง',
  'บรรจุภัณฑ์',
];

const unitOptions = ['กก.', 'ถุง', 'ขวด', 'แกลลอน', 'กล่อง', 'ชิ้น', 'แพ็ค'];

const form = ref({
  name: '',
  code: '',
  category: 'วัตถุดิบสด',
  quantity: 10,
  unit: 'กก.',
  minLevel: 5,
  costPrice: 100,
  supplier: '',
});

watch(
  () => [props.item, props.modelValue],
  ([stk, isOpen]) => {
    if (isOpen) {
      if (stk) {
        const s = stk as StockItem;
        form.value = {
          name: s.name,
          code: s.code,
          category: s.category,
          quantity: s.quantity,
          unit: s.unit,
          minLevel: s.minLevel,
          costPrice: s.costPrice,
          supplier: s.supplier,
        };
      } else {
        form.value = {
          name: '',
          code: `RAW-${Math.floor(100 + Math.random() * 900)}`,
          category: 'วัตถุดิบสด',
          quantity: 20,
          unit: 'กก.',
          minLevel: 5,
          costPrice: 150,
          supplier: '',
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

.stock-form-dialog-card {
  width: 500px;
  max-width: 95vw;

  .stock-form {
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

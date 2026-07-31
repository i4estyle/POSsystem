<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="app-dialog-card menu-form-dialog-card">
      <AppDialogHeader
        :title="
          isEditing
            ? t('menu.editProductTitle', { name: product?.productName || '' })
            : t('menu.addProductTitle')
        "
        :subtitle="t('menu.productFormSubtitle')"
        icon="restaurant_menu"
      />

      <main class="dialog-body">
        <form class="menu-form" @submit.prevent="onSave">
          <AppFormField :label="t('menu.productNameLabel')">
            <q-input
              v-model="form.productName"
              outlined
              dense
              class="custom-input"
              :placeholder="t('menu.productNamePlaceholder')"
              :rules="[(val) => !!val || t('menu.required')]"
            >
              <template #prepend>
                <q-icon name="fastfood" size="18px" class="prefix-icon" />
              </template>
            </q-input>
          </AppFormField>

          <div class="form-row-2col">
            <AppFormField :label="t('menu.categoryLabel')">
              <q-select
                v-model="form.categoryId"
                :options="categoryOptions"
                outlined
                dense
                emit-value
                map-options
                options-dense
                class="custom-select"
              >
                <template #prepend>
                  <q-icon name="category" size="18px" class="prefix-icon" />
                </template>
              </q-select>
            </AppFormField>

            <AppFormField :label="t('menu.skuLabel')">
              <q-input v-model="form.sku" outlined dense class="custom-input" placeholder="SKU-001">
                <template #prepend>
                  <q-icon name="qr_code" size="18px" class="prefix-icon" />
                </template>
              </q-input>
            </AppFormField>
          </div>

          <div class="form-row-2col">
            <AppFormField :label="t('menu.sellingPriceLabel')">
              <q-input
                v-model.number="form.sellingPrice"
                type="number"
                outlined
                dense
                class="custom-input"
                prefix="฿"
                min="0"
                step="0.5"
              />
            </AppFormField>

            <AppFormField :label="t('menu.costPriceLabel')">
              <q-input
                v-model.number="form.costPrice"
                type="number"
                outlined
                dense
                class="custom-input"
                prefix="฿"
                min="0"
                step="0.5"
              />
            </AppFormField>
          </div>

          <div class="form-row-2col">
            <AppFormField :label="t('menu.unitLabel')">
              <q-select
                v-model="form.unit"
                :options="unitOptions"
                outlined
                dense
                options-dense
                class="custom-select"
              />
            </AppFormField>

            <AppFormField :label="t('menu.statusLabel')">
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

          <AppFormField :label="t('menu.imageUrlLabel')">
            <q-input
              v-model="form.imageUrl"
              outlined
              dense
              class="custom-input"
              placeholder="https://..."
            >
              <template #prepend>
                <q-icon name="image" size="18px" class="prefix-icon" />
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
import type { ProductInterface } from '@/types/product';
import AppDialogHeader from '@/components/base/app-dialog-header.vue';
import AppFormField from '@/components/base/app-form-field.vue';
import GradientButton from '@/components/base/gradient-button.vue';

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  product?: ProductInterface | null;
  categories: Array<{ categoryId: number; categoryName: string }>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'save', payload: Omit<ProductInterface, 'productId'> | Partial<ProductInterface>): void;
}>();

const isEditing = computed(() => !!props.product);

const categoryOptions = computed(() =>
  props.categories.map((c) => ({ label: c.categoryName, value: c.categoryId })),
);

const unitOptions = ['ชิ้น', 'แก้ว', 'จาน', 'ชุด', 'เซต', 'ถ้วย'];

const statusOptions = computed(() => [
  { label: t('common.active'), value: 'active' },
  { label: t('common.inactive'), value: 'inactive' },
]);

const form = ref<{
  productName: string;
  categoryId: number;
  sku: string;
  sellingPrice: number;
  costPrice: number;
  unit: string;
  status: 'active' | 'inactive';
  imageUrl: string;
}>({
  productName: '',
  categoryId: 1,
  sku: '',
  sellingPrice: 100,
  costPrice: 50,
  unit: 'ชิ้น',
  status: 'active',
  imageUrl: '',
});

watch(
  () => [props.product, props.modelValue],
  ([p, isOpen]) => {
    if (isOpen) {
      if (p) {
        const item = p as ProductInterface;
        form.value = {
          productName: item.productName,
          categoryId: item.categoryId,
          sku: item.sku,
          sellingPrice: item.sellingPrice,
          costPrice: item.costPrice,
          unit: item.unit,
          status: item.status,
          imageUrl: item.imageUrl || '',
        };
      } else {
        form.value = {
          productName: '',
          categoryId: props.categories[0]?.categoryId || 1,
          sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
          sellingPrice: 100,
          costPrice: 50,
          unit: 'ชิ้น',
          status: 'active',
          imageUrl: '',
        };
      }
    }
  },
  { immediate: true },
);

const onSave = (): void => {
  if (!form.value.productName.trim()) return;
  emit('save', { ...form.value, productName: form.value.productName.trim() });
  emit('update:modelValue', false);
};
</script>

<style lang="scss">
@use '../../css/variables' as *;

.menu-form-dialog-card {
  width: 500px;
  max-width: 95vw;

  .menu-form {
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

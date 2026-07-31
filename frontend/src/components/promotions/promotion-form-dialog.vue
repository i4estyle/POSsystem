<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="app-dialog-card promotion-form-dialog-card">
      <AppDialogHeader
        :title="
          isEditing
            ? t('promotions.editPromoTitle', { code: promo?.code || '' })
            : t('promotions.addPromoTitle')
        "
        :subtitle="t('promotions.promoFormSubtitle')"
        icon="local_offer"
      />

      <main class="dialog-body">
        <form class="promotion-form" @submit.prevent="onSave">
          <div class="form-row-2col">
            <AppFormField :label="t('promotions.code')">
              <q-input
                v-model="form.code"
                outlined
                dense
                class="custom-input uppercase-input"
                placeholder="PROMO2026"
                :rules="[(val) => !!val || t('common.required')]"
              >
                <template #prepend>
                  <q-icon name="confirmation_number" size="18px" class="prefix-icon" />
                </template>
              </q-input>
            </AppFormField>

            <AppFormField :label="t('promotions.discountType')">
              <q-select
                v-model="form.discountType"
                :options="discountTypeOptions"
                outlined
                dense
                emit-value
                map-options
                options-dense
                class="custom-select"
              />
            </AppFormField>
          </div>

          <AppFormField :label="t('promotions.promoTitle')">
            <q-input
              v-model="form.title"
              outlined
              dense
              class="custom-input"
              :placeholder="t('promotions.promoTitlePlaceholder')"
            />
          </AppFormField>

          <AppFormField :label="t('promotions.description')">
            <q-input
              v-model="form.description"
              outlined
              dense
              type="textarea"
              rows="2"
              class="custom-input"
            />
          </AppFormField>

          <div class="form-row-2col">
            <AppFormField :label="t('promotions.discountValue')">
              <q-input
                v-model.number="form.discountValue"
                type="number"
                outlined
                dense
                class="custom-input"
                :prefix="form.discountType === 'fixed' ? '฿' : '%'"
                min="1"
              />
            </AppFormField>

            <AppFormField :label="t('promotions.minOrderAmount')">
              <q-input
                v-model.number="form.minOrderAmount"
                type="number"
                outlined
                dense
                class="custom-input"
                prefix="฿"
                min="0"
              />
            </AppFormField>
          </div>

          <div class="form-row-2col">
            <AppFormField :label="t('promotions.startDate')">
              <q-input v-model="form.startDate" type="date" outlined dense class="custom-input" />
            </AppFormField>

            <AppFormField :label="t('promotions.endDate')">
              <q-input v-model="form.endDate" type="date" outlined dense class="custom-input" />
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
import type { PromotionItem } from '@/stores/promotion-store';
import AppDialogHeader from '@/components/base/app-dialog-header.vue';
import AppFormField from '@/components/base/app-form-field.vue';
import GradientButton from '@/components/base/gradient-button.vue';

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  promo?: PromotionItem | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'save', payload: Omit<PromotionItem, 'id' | 'usageCount'> | Partial<PromotionItem>): void;
}>();

const isEditing = computed(() => !!props.promo);

const discountTypeOptions = computed(() => [
  { label: t('promotions.percentage'), value: 'percentage' },
  { label: t('promotions.fixedAmount'), value: 'fixed' },
]);

const form = ref<{
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
}>({
  code: '',
  title: '',
  description: '',
  discountType: 'percentage',
  discountValue: 10,
  minOrderAmount: 200,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '2026-12-31',
  status: 'active',
});

watch(
  () => [props.promo, props.modelValue],
  ([pr, isOpen]) => {
    if (isOpen) {
      if (pr) {
        const p = pr as PromotionItem;
        form.value = {
          code: p.code,
          title: p.title,
          description: p.description,
          discountType: p.discountType,
          discountValue: p.discountValue,
          minOrderAmount: p.minOrderAmount,
          startDate: p.startDate,
          endDate: p.endDate,
          status: p.status,
        };
      } else {
        form.value = {
          code: '',
          title: '',
          description: '',
          discountType: 'percentage',
          discountValue: 10,
          minOrderAmount: 200,
          startDate: new Date().toISOString().slice(0, 10),
          endDate: '2026-12-31',
          status: 'active',
        };
      }
    }
  },
  { immediate: true },
);

const onSave = (): void => {
  if (!form.value.code.trim()) return;
  emit('save', {
    ...form.value,
    code: form.value.code.toUpperCase().trim(),
    title: form.value.title.trim() || form.value.code.toUpperCase().trim(),
  });
  emit('update:modelValue', false);
};
</script>

<style lang="scss">
@use '../../css/variables' as *;

.promotion-form-dialog-card {
  width: 500px;
  max-width: 95vw;

  .promotion-form {
    display: flex;
    flex-direction: column;
    gap: 14px;

    .form-row-2col {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .uppercase-input {
      input {
        text-transform: uppercase;
      }
    }
  }
}
</style>

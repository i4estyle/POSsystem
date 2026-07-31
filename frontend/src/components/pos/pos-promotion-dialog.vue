<template>
  <AppBaseDialog
    :model-value="modelValue"
    :title="t('pos.promotion.title')"
    icon="local_offer"
    width="540px"
    max-width="95vw"
    :show-actions="false"
    class="pos-promotion-dialog"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="promotion-dialog-body">
      <AppFormField>
        <q-input
          v-model="searchQuery"
          outlined
          dense
          class="search-input q-mb-sm"
          :placeholder="t('pos.promotion.searchPlaceholder')"
          clearable
        >
          <template #prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </AppFormField>

      <section
        v-if="filteredPromotions.length === 0"
        class="empty-state text-center q-pa-xl text-grey-7"
      >
        <q-avatar size="64px" color="purple-1" text-color="primary" class="q-mb-sm">
          <q-icon name="confirmation_number" size="36px" />
        </q-avatar>
        <p class="text-body1 text-weight-medium q-ma-none">{{ t('pos.promotion.noPromotions') }}</p>
      </section>

      <section v-else class="promotion-list">
        <article
          v-for="promo in filteredPromotions"
          :key="promo.id"
          class="promo-card-item row items-center justify-between q-pa-md q-mb-sm rounded-borders cursor-pointer"
          :class="{
            'is-selected': selectedPromotionId === promo.id,
            'is-disabled': currentSubtotal < promo.minOrderAmount,
          }"
          @click="onSelect(promo)"
        >
          <div class="promo-left col">
            <div class="row items-center q-gutter-xs q-mb-xs">
              <q-chip
                dense
                color="deep-purple-1"
                text-color="deep-purple-9"
                class="text-weight-bold promo-chip"
              >
                <q-icon name="loyalty" size="13px" class="q-mr-xs" />
                {{ promo.code }}
              </q-chip>
              <span class="text-weight-bold text-subtitle1 promo-title">{{ promo.title }}</span>
            </div>
            <p class="text-caption text-grey-7 q-ma-none line-clamp-2 promo-desc">
              {{ promo.description }}
            </p>
            <div class="text-caption text-secondary q-mt-xs row items-center q-gutter-xs">
              <q-icon name="shopping_bag" size="14px" />
              <span>{{
                t('pos.promotion.minOrder', { amount: promo.minOrderAmount.toLocaleString() })
              }}</span>
            </div>
          </div>

          <div class="promo-right column items-end justify-center q-pl-md">
            <div class="discount-badge-box q-mb-xs">
              <span class="discount-badge-text">
                {{
                  promo.discountType === 'percentage'
                    ? `-${promo.discountValue}%`
                    : `-฿${promo.discountValue.toLocaleString()}`
                }}
              </span>
            </div>
            <q-btn
              unelevated
              rounded
              no-caps
              :color="selectedPromotionId === promo.id ? 'positive' : 'primary'"
              :disabled="currentSubtotal < promo.minOrderAmount"
              class="use-btn"
              @click.stop="onSelect(promo)"
            >
              <q-icon
                :name="selectedPromotionId === promo.id ? 'check_circle' : 'add_circle'"
                size="15px"
                class="q-mr-xs"
              />
              <span>
                {{
                  selectedPromotionId === promo.id
                    ? t('pos.promotion.applied')
                    : t('pos.promotion.use')
                }}
              </span>
            </q-btn>
          </div>
        </article>
      </section>
    </div>
  </AppBaseDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppBaseDialog from '@/components/base/app-base-dialog.vue';
import AppFormField from '@/components/base/app-form-field.vue';
import { usePromotionStore, type PromotionItem } from '@/stores/promotion-store';

const { t } = useI18n();
const promotionStore = usePromotionStore();

const props = defineProps<{
  modelValue: boolean;
  selectedPromotionId?: number | null | undefined;
  currentSubtotal: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'select-promotion', promo: PromotionItem): void;
}>();

const searchQuery = ref('');

const filteredPromotions = computed(() => {
  return promotionStore.promotions.filter((p) => {
    if (p.status !== 'active') return false;
    if (!searchQuery.value.trim()) return true;
    const q = searchQuery.value.toLowerCase().trim();
    return (
      p.code.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });
});

const onSelect = (promo: PromotionItem): void => {
  if (props.currentSubtotal >= promo.minOrderAmount) {
    emit('select-promotion', promo);
    emit('update:modelValue', false);
  }
};
</script>

<style lang="scss" scoped>
@use '../../css/variables' as *;

.promotion-dialog-body {
  font-family: $font-family-base;

  .search-input {
    :deep(.q-field__control) {
      border-radius: $radius-lg;
      background: $color-bg-surface;
      border-color: rgba(208, 195, 241, 0.6);
    }
  }

  .promotion-list {
    max-height: 420px;
    overflow-y: auto;
    padding-right: 8px;

    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(208, 195, 241, 0.6);
      border-radius: 10px;
    }
  }

  .promo-card-item {
    background: #ffffff;
    border: 1.5px solid $color-border-subtle;
    border-radius: $radius-lg;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover:not(.is-disabled) {
      border-color: $color-primary;
      box-shadow: 0 6px 20px rgba(99, 88, 128, 0.14);
    }

    &.is-selected {
      border-color: #22c55e;
      background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
      box-shadow: 0 4px 16px rgba(34, 197, 94, 0.16);

      .discount-badge-box {
        background: linear-gradient(
          135deg,
          rgba(34, 197, 94, 0.14) 0%,
          rgba(16, 185, 129, 0.14) 100%
        );
        border-color: rgba(34, 197, 94, 0.3);

        .discount-badge-text {
          color: #15803d;
        }
      }
    }

    &.is-disabled {
      opacity: 0.55;
      cursor: not-allowed;
      background: #f8fafc;

      .discount-badge-box {
        background: rgba(148, 163, 184, 0.12);
        border-color: rgba(148, 163, 184, 0.25);

        .discount-badge-text {
          color: #64748b;
        }
      }
    }

    .promo-title {
      color: $color-text-main;
      font-family: $font-family-base;
    }

    .promo-chip {
      font-size: 11px;
      padding: 2px 8px;
    }

    .promo-right {
      min-width: 115px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }

    .discount-badge-box {
      display: inline-flex;
      align-items: center;
      padding: 3px 12px;
      border-radius: $radius-full;
      background: linear-gradient(
        135deg,
        rgba(109, 40, 217, 0.1) 0%,
        rgba(219, 39, 119, 0.12) 100%
      );
      border: 1px solid rgba(109, 40, 217, 0.22);
      box-shadow: 0 2px 6px rgba(109, 40, 217, 0.06);

      .discount-badge-text {
        font-family: 'Plus Jakarta Sans', $font-family-base;
        font-size: 17px;
        font-weight: 800;
        color: #5b21b6;
        letter-spacing: -0.3px;
        white-space: nowrap;
      }
    }

    .use-btn {
      font-family: $font-family-base;
      font-weight: 700;
      font-size: 12.5px;
      height: 32px;
      min-height: 32px;
      white-space: nowrap;
      padding: 0 14px;
      border-radius: $radius-full;
      box-shadow: 0 2px 8px rgba(99, 88, 128, 0.16);
      letter-spacing: 0.2px;

      :deep(.q-icon) {
        font-size: 15px !important;
      }
    }
  }
}
</style>

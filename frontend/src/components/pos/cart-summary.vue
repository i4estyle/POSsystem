<template>
  <footer class="cart-summary-footer">
    <section class="summary-row">
      <span>{{ t('pos.subtotal') }}</span>
      <span>฿{{ formattedSubtotal }}</span>
    </section>

    <section v-if="discount > 0" class="summary-row text-positive text-weight-bold">
      <span>{{ t('pos.discount') }}</span>
      <span>-฿{{ formattedDiscount }}</span>
    </section>

    <section class="summary-row">
      <span>{{ t('pos.tax') }}</span>
      <span>฿{{ formattedTax }}</span>
    </section>

    <section class="summary-row total-row">
      <span>{{ t('pos.total') }}</span>
      <span class="total-amount">฿{{ formattedTotal }}</span>
    </section>

    <!-- Quick Actions: Promotion & Member -->
    <section class="cart-action-bar row q-gutter-x-sm q-mt-xs">
      <button
        type="button"
        class="cart-quick-btn promo-btn col row items-center justify-center q-px-sm q-py-xs"
        @click="$emit('open-promotion-dialog')"
      >
        <span class="btn-icon-badge promo-icon-badge">
          <q-icon name="local_offer" size="15px" />
        </span>
        <span class="btn-label text-weight-bold">
          {{ t('pos.cartAction.promotion') }}
        </span>
      </button>

      <button
        type="button"
        class="cart-quick-btn member-btn col row items-center justify-center q-px-sm q-py-xs"
        @click="$emit('open-member-dialog')"
      >
        <span class="btn-icon-badge member-icon-badge">
          <q-icon name="person_search" size="15px" />
        </span>
        <span class="btn-label text-weight-bold">
          {{ t('pos.cartAction.member') }}
        </span>
      </button>
    </section>

    <!-- Sleek Custom Active Status Cards (Replaces default q-chips) -->
    <section
      v-if="selectedPromotion || selectedMember"
      class="active-selected-bar column q-gutter-y-xs q-mt-xs"
    >
      <!-- Active Promotion Pill Card -->
      <div
        v-if="selectedPromotion"
        class="active-status-card promo-status-card row items-center justify-between"
      >
        <div class="row items-center q-gutter-x-xs col min-width-0">
          <span class="status-icon-circle promo-status-icon">
            <q-icon name="local_offer" size="12px" />
          </span>
          <span class="status-title text-weight-bold">
            {{ selectedPromotion.code }}
          </span>
          <span class="status-subtitle text-weight-bold">
            (-{{
              selectedPromotion.discountType === 'percentage'
                ? `${selectedPromotion.discountValue}%`
                : `฿${selectedPromotion.discountValue}`
            }})
          </span>
        </div>
        <button
          type="button"
          class="remove-status-btn"
          title="Remove promotion"
          @click.stop="$emit('remove-promotion')"
        >
          <q-icon name="close" size="13px" />
        </button>
      </div>

      <!-- Active Member Pill Card -->
      <div
        v-if="selectedMember"
        class="active-status-card member-status-card row items-center justify-between"
      >
        <div class="row items-center q-gutter-x-xs col min-width-0">
          <span class="status-icon-circle member-status-icon">
            <q-icon name="person" size="12px" />
          </span>
          <span class="status-title text-weight-bold">
            {{ selectedMember.name }}
          </span>
          <span class="status-subtitle text-weight-bold"> ({{ selectedMember.points }} pt) </span>
        </div>
        <button
          type="button"
          class="remove-status-btn"
          title="Remove member"
          @click.stop="$emit('remove-member')"
        >
          <q-icon name="close" size="13px" />
        </button>
      </div>
    </section>

    <!-- Sleek & Modern Confirm Order Button -->
    <button
      type="button"
      class="confirm-btn q-mt-sm"
      :disabled="disabled || isSubmitting"
      @click="$emit('confirm')"
    >
      <q-spinner v-if="isSubmitting" size="22px" color="white" />
      <template v-else>
        <span class="confirm-btn-label">{{ t('pos.confirmOrder') }}</span>
        <span class="confirm-btn-badge">
          <q-icon name="arrow_forward" size="16px" />
        </span>
      </template>
    </button>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PromotionItem } from '@/stores/promotion-store';
import type { MemberItem } from '@/stores/member-store';

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    subtotal: number;
    discount?: number | undefined;
    tax: number;
    total: number;
    disabled?: boolean | undefined;
    isSubmitting?: boolean | undefined;
    selectedPromotion?: PromotionItem | null | undefined;
    selectedMember?: MemberItem | null | undefined;
  }>(),
  {
    discount: 0,
    disabled: false,
    isSubmitting: false,
    selectedPromotion: null,
    selectedMember: null,
  },
);

defineEmits<{
  (e: 'confirm'): void;
  (e: 'open-promotion-dialog'): void;
  (e: 'open-member-dialog'): void;
  (e: 'remove-promotion'): void;
  (e: 'remove-member'): void;
}>();

const formattedSubtotal = computed(() => props.subtotal.toFixed(2));
const formattedDiscount = computed(() => (props.discount || 0).toFixed(2));
const formattedTax = computed(() => props.tax.toFixed(2));
const formattedTotal = computed(() => props.total.toFixed(2));
</script>

<style lang="scss" scoped>
@use '../../css/variables' as *;

.cart-summary-footer {
  background-color: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 'Sarabun', 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px;
    color: $color-text-body;

    &.total-row {
      margin-top: 2px;
      padding-top: 6px;
      border-top: 1px dashed rgba(0, 0, 0, 0.08);
      font-size: 15px;
      font-weight: 700;
      color: $color-text-main;

      .total-amount {
        font-size: 21px;
        font-weight: 800;
        color: $color-primary;
      }
    }
  }

  .cart-action-bar {
    margin-top: 4px;
  }

  .cart-quick-btn {
    height: 42px;
    border-radius: $radius-full;
    border: 1.5px solid transparent;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: $font-family-base;
    gap: 8px;
    position: relative;
    overflow: hidden;
    min-width: 0;
    padding: 0 12px;

    .btn-icon-badge {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .q-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        margin: 0;
      }
    }

    .btn-label {
      font-size: 13px;
      font-weight: 700;
      min-width: 0;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }

    &:hover {
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }

    &.promo-btn {
      color: $color-primary-dark;
      background: linear-gradient(
        135deg,
        rgba(208, 195, 241, 0.35) 0%,
        rgba(255, 215, 238, 0.45) 100%
      );
      border-color: rgba(208, 195, 241, 0.8);
      box-shadow: 0 2px 8px rgba(208, 195, 241, 0.3);

      .promo-icon-badge {
        background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
        color: #ffffff;
        box-shadow: 0 2px 6px rgba(99, 88, 128, 0.2);
      }

      &:hover {
        background: linear-gradient(
          135deg,
          rgba(208, 195, 241, 0.55) 0%,
          rgba(255, 215, 238, 0.65) 100%
        );
        border-color: $color-primary;
        box-shadow: 0 4px 14px rgba(99, 88, 128, 0.18);
      }
    }

    &.member-btn {
      color: $color-secondary;
      background: linear-gradient(
        135deg,
        rgba(206, 238, 248, 0.45) 0%,
        rgba(233, 249, 229, 0.45) 100%
      );
      border-color: rgba(206, 238, 248, 0.9);
      box-shadow: 0 2px 8px rgba(206, 238, 248, 0.4);

      .member-icon-badge {
        background: linear-gradient(135deg, $color-secondary 0%, #2e474f 100%);
        color: #ffffff;
        box-shadow: 0 2px 6px rgba(69, 99, 107, 0.2);
      }

      &:hover {
        background: linear-gradient(
          135deg,
          rgba(206, 238, 248, 0.65) 0%,
          rgba(233, 249, 229, 0.65) 100%
        );
        border-color: $color-secondary;
        box-shadow: 0 4px 14px rgba(69, 99, 107, 0.18);
      }
    }
  }

  .active-selected-bar {
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .active-status-card {
    border-radius: $radius-full;
    padding: 5px 10px 5px 6px;
    font-family: 'Sarabun', $font-family-base;
    font-size: 12.5px;
    transition: all 0.2s ease;

    .min-width-0 {
      min-width: 0;
    }

    .status-icon-circle {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .q-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }
    }

    .status-title {
      font-weight: 700;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status-subtitle {
      font-size: 11.5px;
      opacity: 0.85;
      flex-shrink: 0;
    }

    .remove-status-btn {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.08);
      color: inherit;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s ease;
      margin-left: 6px;

      &:hover {
        background: rgba(0, 0, 0, 0.18);
        transform: scale(1.1);
      }
    }

    &.promo-status-card {
      background: linear-gradient(
        135deg,
        rgba(237, 233, 254, 0.95) 0%,
        rgba(251, 207, 232, 0.95) 100%
      );
      border: 1px solid rgba(192, 132, 252, 0.45);
      color: #581c87;

      .promo-status-icon {
        background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
        color: #ffffff;
      }

      .remove-status-btn:hover {
        background: #7e22ce;
        color: #ffffff;
      }
    }

    &.member-status-card {
      background: linear-gradient(
        135deg,
        rgba(204, 251, 241, 0.95) 0%,
        rgba(220, 252, 231, 0.95) 100%
      );
      border: 1px solid rgba(45, 212, 191, 0.45);
      color: #0f766e;

      .member-status-icon {
        background: linear-gradient(135deg, $color-secondary 0%, #2e474f 100%);
        color: #ffffff;
      }

      .remove-status-btn:hover {
        background: #0f766e;
        color: #ffffff;
      }
    }
  }

  .confirm-btn {
    margin-top: 6px;
    height: 48px;
    border-radius: $radius-full;
    background: linear-gradient(135deg, $color-primary 0%, #4a386c 100%);
    color: #ffffff;
    font-family: 'Sarabun', $font-family-base;
    font-size: 15.5px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 0 20px;
    box-shadow: 0 4px 16px rgba(99, 88, 128, 0.32);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

    .confirm-btn-label {
      letter-spacing: 0.3px;
    }

    .confirm-btn-badge {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.22);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition:
        transform 0.25s ease,
        background 0.25s ease;

      .q-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        margin: 0;
      }
    }

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 88, 128, 0.42);
      background: linear-gradient(135deg, #716295 0%, #523f77 100%);

      .confirm-btn-badge {
        background: rgba(255, 255, 255, 0.35);
        transform: translateX(3px);
      }
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(99, 88, 128, 0.28);
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      box-shadow: none;
      filter: grayscale(0.3);
    }
  }
}
</style>

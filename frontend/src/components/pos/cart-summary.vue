<template>
  <footer class="cart-summary-footer">
    <section class="summary-row">
      <span>{{ t('pos.subtotal') }}</span>
      <span>฿{{ formattedSubtotal }}</span>
    </section>

    <section class="summary-row">
      <span>{{ t('pos.tax') }}</span>
      <span>฿{{ formattedTax }}</span>
    </section>

    <section class="summary-row total-row">
      <span>{{ t('pos.total') }}</span>
      <span class="total-amount">฿{{ formattedTotal }}</span>
    </section>

    <button
      type="button"
      class="confirm-btn"
      :disabled="disabled || isSubmitting"
      @click="$emit('confirm')"
    >
      <q-spinner v-if="isSubmitting" size="20px" color="white" />
      <template v-else>
        <span>{{ t('pos.confirmOrder') }}</span>
        <q-icon name="arrow_forward" size="18px" />
      </template>
    </button>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  subtotal: number;
  tax: number;
  total: number;
  disabled?: boolean;
  isSubmitting?: boolean;
}>();

defineEmits<{
  (e: 'confirm'): void;
}>();

const formattedSubtotal = computed(() => props.subtotal.toFixed(2));
const formattedTax = computed(() => props.tax.toFixed(2));
const formattedTotal = computed(() => props.total.toFixed(2));
</script>

<template>
  <q-select
    class="orders-status-filter"
    outlined
    dense
    emit-value
    map-options
    :model-value="modelValue"
    :options="options"
    :aria-label="t('orders.filterLabel')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #prepend><q-icon name="tune" size="18px" /></template>
  </q-select>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { OrderFilterValue } from '@/types/orders-kanban';

const { t } = useI18n();

defineProps<{ modelValue: OrderFilterValue }>();
defineEmits<{ 'update:modelValue': [value: OrderFilterValue] }>();

const options = computed(() => [
  { label: t('orders.allOrders'), value: 'all' },
  { label: t('orders.statuses.new'), value: 'new' },
  { label: t('orders.statuses.preparing'), value: 'preparing' },
  { label: t('orders.statuses.ready'), value: 'ready' },
  { label: t('orders.statuses.served'), value: 'served' },
]);
</script>

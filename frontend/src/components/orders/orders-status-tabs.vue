<template>
  <div class="orders-status-tabs" :aria-label="t('orders.filterLabel')">
    <button
      v-for="status in statuses"
      :key="status"
      type="button"
      :class="[`status-${status}`, { active: modelValue === status }]"
      @click="$emit('update:modelValue', modelValue === status ? 'all' : status)"
    >
      <i /> {{ t(`orders.statuses.${status}`) }} <span>{{ counts[status] }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { KanbanStatus, OrderFilterValue } from '@/types/orders-kanban';

defineProps<{
  modelValue: OrderFilterValue;
  counts: Record<KanbanStatus, number>;
}>();

defineEmits<{ 'update:modelValue': [value: OrderFilterValue] }>();

const { t } = useI18n();
const statuses: KanbanStatus[] = ['new', 'preparing', 'ready', 'served'];
</script>

<template>
  <div class="orders-date-sort-filter">
    <q-input class="orders-date-input" outlined dense readonly :model-value="formattedDate">
      <template #prepend><q-icon name="calendar_today" size="17px" /></template>
      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
        <q-date
          :model-value="selectedDate"
          mask="YYYY/MM/DD"
          @update:model-value="$emit('update:selectedDate', $event)"
        />
      </q-popup-proxy>
    </q-input>
    <q-select
      class="orders-sort-select"
      outlined
      dense
      emit-value
      map-options
      :model-value="sortOrder"
      :options="sortOptions"
      :aria-label="t('orders.sortLabel')"
      @update:model-value="$emit('update:sortOrder', $event)"
    >
      <template #prepend><q-icon name="sort" size="18px" /></template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { OrderSortOrder } from '@/types/orders-kanban';

defineProps<{
  selectedDate: string;
  formattedDate: string;
  sortOrder: OrderSortOrder;
}>();

defineEmits<{
  'update:selectedDate': [value: string];
  'update:sortOrder': [value: OrderSortOrder];
}>();

const { t } = useI18n();
const sortOptions = computed(() => [
  { label: t('orders.sortNewest'), value: 'newest' },
  { label: t('orders.sortOldest'), value: 'oldest' },
]);
</script>

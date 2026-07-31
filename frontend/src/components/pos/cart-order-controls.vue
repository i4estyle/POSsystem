<template>
  <section class="order-controls">
    <nav class="order-type-toggle">
      <button
        type="button"
        class="toggle-btn"
        :class="{ active: orderType === OrderType.DINE_IN }"
        @click="$emit('update:orderType', OrderType.DINE_IN)"
      >
        {{ t('pos.dineIn') }}
      </button>
      <button
        type="button"
        class="toggle-btn"
        :class="{ active: orderType === OrderType.TAKEAWAY }"
        @click="$emit('update:orderType', OrderType.TAKEAWAY)"
      >
        {{ t('pos.takeaway') }}
      </button>
    </nav>

    <section v-if="orderType === OrderType.DINE_IN" class="table-select-box">
      <q-select
        dense
        outlined
        options-dense
        :model-value="selectedTableId"
        :options="tableOptions"
        emit-value
        map-options
        :label="t('pos.selectTable')"
        @update:model-value="$emit('update:selectedTableId', $event)"
      />
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { OrderType } from '@/types/order';
import type { TableManagementItem } from '@/types/dining-table';

const { t } = useI18n();

const props = defineProps<{
  orderType: OrderType;
  selectedTableId: number | null;
  tables: TableManagementItem[];
}>();

defineEmits<{
  (e: 'update:orderType', value: OrderType): void;
  (e: 'update:selectedTableId', value: number | null): void;
}>();

const tableOptions = computed(() => {
  return props.tables
    .filter((tbl) => tbl.status === 'available')
    .map((tbl) => ({
      label: tbl.tableNumber,
      value: tbl.tableId,
    }));
});
</script>

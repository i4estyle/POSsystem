<template>
  <section class="tables-cards-container">
    <section class="tables-cards-grid">
      <TableCard
        v-for="(table, index) in paginatedTables"
        :key="table.tableId"
        :table="table"
        :is-focused="table.tableId === focusedTableId"
        :show-status-guide="index === 0"
        @focus-table="(id) => emit('focus-table', id)"
        @edit-table="(t) => emit('edit-table', t)"
        @show-qr="(t) => emit('show-qr', t)"
        @update-status="(t, status) => emit('update-status', t, status)"
      />
      <TableQuickCreateCard @click="emit('quick-create')" />
    </section>

    <footer v-if="tables.length > 0" class="tables-pagination-bar">
      <AppPagination
        :page="currentPage"
        :max-pages="totalPages"
        :showing-from="showingFrom"
        :showing-to="showingTo"
        :total-rows="tables.length"
        :show-rows-per-page="false"
        @update:page="(p) => emit('update:currentPage', p)"
      />
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import type { TableManagementItem, TableStatus } from '@/types/dining-table';
import AppPagination from '@/components/base/app-pagination.vue';
import TableCard from './table-card.vue';
import TableQuickCreateCard from './table-quick-create-card.vue';

const props = withDefaults(
  defineProps<{
    tables: TableManagementItem[];
    currentPage?: number;
    pageSize?: number;
    focusedTableId?: number | null;
  }>(),
  {
    currentPage: 1,
    pageSize: 7,
    focusedTableId: null,
  },
);

const emit = defineEmits<{
  (e: 'focus-table', tableId: number): void;
  (e: 'edit-table', table: TableManagementItem): void;
  (e: 'show-qr', table: TableManagementItem): void;
  (e: 'update-status', table: TableManagementItem, status: TableStatus): void;
  (e: 'quick-create'): void;
  (e: 'update:currentPage', page: number): void;
}>();

const totalPages = computed(() => Math.ceil(props.tables.length / props.pageSize) || 1);

const paginatedTables = computed(() => {
  const start = (props.currentPage - 1) * props.pageSize;
  return props.tables.slice(start, start + props.pageSize);
});

const showingFrom = computed(() => {
  if (!props.tables.length) return 0;
  return (props.currentPage - 1) * props.pageSize + 1;
});

const showingTo = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.tables.length);
});

watch(totalPages, (nextTotalPages) => {
  if (props.currentPage > nextTotalPages) {
    emit('update:currentPage', nextTotalPages);
  }
});
</script>

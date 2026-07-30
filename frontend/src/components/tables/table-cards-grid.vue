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

    <footer v-if="totalPages > 1" class="tables-pagination-bar">
      <small class="showing-info">
        {{
          t('tablePagination.showingInfo', {
            from: showingFrom,
            to: showingTo,
            total: tables.length,
          })
        }}
      </small>

      <nav class="pagination-controls">
        <button
          ref="previousPageButton"
          type="button"
          class="page-btn"
          :disabled="currentPage <= 1"
          @click="changePage(currentPage - 1, 'previous')"
        >
          <q-icon name="chevron_left" size="20px" />
        </button>

        <span class="page-indicator">
          {{ t('tablePagination.pageInfo', { current: currentPage, total: totalPages }) }}
        </span>

        <button
          ref="nextPageButton"
          type="button"
          class="page-btn"
          :disabled="currentPage >= totalPages"
          @click="changePage(currentPage + 1, 'next')"
        >
          <q-icon name="chevron_right" size="20px" />
        </button>
      </nav>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TableManagementItem, TableStatus } from '@/types/dining-table';
import TableCard from './table-card.vue';
import TableQuickCreateCard from './table-quick-create-card.vue';

const { t } = useI18n();

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

const previousPageButton = ref<HTMLButtonElement | null>(null);
const nextPageButton = ref<HTMLButtonElement | null>(null);
const pendingPaginationFocus = ref<'previous' | 'next' | null>(null);

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

const focusPaginationButton = async (): Promise<void> => {
  await nextTick();

  const preferredButton =
    pendingPaginationFocus.value === 'next' ? nextPageButton.value : previousPageButton.value;
  const fallbackButton =
    pendingPaginationFocus.value === 'next' ? previousPageButton.value : nextPageButton.value;
  const targetButton = preferredButton?.disabled ? fallbackButton : preferredButton;

  targetButton?.focus({ preventScroll: true });
  targetButton?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest',
  });

  pendingPaginationFocus.value = null;
};

const changePage = (page: number, direction: 'previous' | 'next'): void => {
  pendingPaginationFocus.value = direction;
  emit('update:currentPage', page);
};

watch(totalPages, (nextTotalPages) => {
  if (props.currentPage > nextTotalPages) {
    emit('update:currentPage', nextTotalPages);
  }
});

watch(
  () => props.currentPage,
  () => {
    if (pendingPaginationFocus.value) {
      void focusPaginationButton();
    }
  },
);
</script>

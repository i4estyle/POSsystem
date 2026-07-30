<template>
  <q-page class="tables-page">
    <section class="pos-sales-layout tables-layout">
      <PosSidebarNav @new-order="notifyNewOrder" />
      <main class="pos-main-wrapper tables-main">
        <PosHeaderBar />

        <section class="tables-content">
          <header class="tables-header">
            <section>
              <h1>{{ t('tables.title') }}</h1>
              <small>{{ t('tables.subtitle') }}</small>
            </section>
          </header>

          <TableSummaryCards :tables="tables" />

          <TableFloorMap
            :branch-name="currentBranchName"
            :tables="tables"
            :focused-table-id="focusedTableId"
            @focus-card="onFocusCardFromMap"
            @expand-map="onExpandMap"
          />

          <TableCardsGrid
            v-model:current-page="currentPage"
            :tables="filteredTables"
            :page-size="pageSize"
            :focused-table-id="focusedTableId"
            @focus-table="onFocusTableInMap"
            @edit-table="onOpenEditDialog"
            @show-qr="onShowQr"
            @update-status="onUpdateTableStatus"
            @quick-create="onOpenAddDialog"
          />
        </section>
      </main>
    </section>

    <TableFormDialog
      v-model="isFormDialogOpen"
      :table="editingTable"
      @save="onSaveTable"
      @delete="onDeleteTable"
    />

    <TableExpandedMapDialog v-model="isMapExpanded" :branch-name="currentBranchName" />

    <TableQrDialog v-model="isQrDialogOpen" :table="selectedQrTable" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { useSearchState } from '@/composables/use-search-state';
import { useTableManagement } from '@/composables/use-table-management';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import type { TableManagementItem, TableStatus } from '@/types/dining-table';
import TableSummaryCards from '@/components/tables/table-summary-cards.vue';
import TableCardsGrid from '@/components/tables/table-cards-grid.vue';
import TableFloorMap from '@/components/tables/table-floor-map.vue';
import TableFormDialog from '@/components/tables/table-form-dialog.vue';
import TableExpandedMapDialog from '@/components/tables/table-expanded-map-dialog.vue';
import TableQrDialog from '@/components/tables/table-qr-dialog.vue';

const $q = useQuasar();
const { t } = useI18n();
const authStore = useAuthStore();
const { searchQuery } = useSearchState();

const { tables, currentPage, pageSize, addTable, updateTable, deleteTable } = useTableManagement();

const isFormDialogOpen = ref(false);
const isMapExpanded = ref(false);
const isQrDialogOpen = ref(false);

const focusedTableId = ref<number | null>(null);
let focusTimer: ReturnType<typeof setTimeout> | null = null;

const editingTable = ref<TableManagementItem | null>(null);
const selectedQrTable = ref<TableManagementItem | null>(null);

const currentBranchName = computed(
  () =>
    authStore.currentUser?.branchName ||
    authStore.currentUser?.branch?.branchName ||
    'Downtown Branch',
);

const filteredTables = computed(() =>
  tables.value.filter((table) => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchNumber = table.tableNumber.toLowerCase().includes(q);
      const matchName = table.reservedName?.toLowerCase().includes(q) || false;
      return matchNumber || matchName;
    }
    return true;
  }),
);

const notifyNewOrder = (): void => {
  $q.notify({ message: t('orders.newOrderPending'), color: 'primary', position: 'top' });
};

const triggerFocusHighlight = (tableId: number): void => {
  if (focusTimer) clearTimeout(focusTimer);
  focusedTableId.value = tableId;
  focusTimer = setTimeout(() => {
    focusedTableId.value = null;
  }, 2500);
};

const onFocusTableInMap = async (tableId: number): Promise<void> => {
  triggerFocusHighlight(tableId);

  await nextTick();

  let attempts = 0;
  const maxAttempts = 100;

  const checkAndScroll = (): Promise<boolean> => {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const mapNode = document.getElementById(`map-node-t${tableId}`);
        if (mapNode) {
          const headerHeight =
            document.querySelector<HTMLElement>('.q-header')?.offsetHeight ?? 64;
          const rect = mapNode.getBoundingClientRect();
          const topPos = window.scrollY + rect.top - headerHeight - 24;

          window.scrollTo({ top: topPos, behavior: 'smooth' });
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  };

  while (attempts < maxAttempts) {
    const scrolled = await checkAndScroll();
    if (scrolled) return;

    attempts += 1;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }

  const mapElement = document.querySelector<HTMLElement>('.floor-map-card');
  if (mapElement) {
    mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const scrollToTableCard = async (tableId: number): Promise<void> => {
  await nextTick();

  let attempts = 0;
  const maxAttempts = 100;

  const checkAndScroll = (): Promise<boolean> => {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const targetCard = document.getElementById(`table-card-${tableId}`);
        if (targetCard) {
          const headerHeight =
            document.querySelector<HTMLElement>('.q-header')?.offsetHeight ?? 64;
          const rect = targetCard.getBoundingClientRect();
          const topPos = window.scrollY + rect.top - headerHeight - 24;

          window.scrollTo({ top: topPos, behavior: 'smooth' });
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  };

  while (attempts < maxAttempts) {
    const scrolled = await checkAndScroll();
    if (scrolled) return;

    attempts += 1;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }

  const gridElement = document.querySelector<HTMLElement>('.tables-cards-container');
  if (gridElement) {
    gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const onFocusCardFromMap = async (tableId: number): Promise<void> => {
  const tableIndex = filteredTables.value.findIndex((t) => t.tableId === tableId);
  if (tableIndex !== -1) {
    const targetPage = Math.floor(tableIndex / pageSize.value) + 1;
    currentPage.value = targetPage;
  }

  triggerFocusHighlight(tableId);
  await scrollToTableCard(tableId);
};

const onOpenAddDialog = (): void => {
  editingTable.value = null;
  isFormDialogOpen.value = true;
};

const onOpenEditDialog = (table: TableManagementItem): void => {
  editingTable.value = table;
  isFormDialogOpen.value = true;
};

const onSaveTable = (data: Partial<TableManagementItem>): void => {
  if (editingTable.value) {
    updateTable(editingTable.value.tableId, data);
    $q.notify({
      message: t('tables.tableUpdatedSuccess', {
        number: data.tableNumber || editingTable.value.tableNumber,
      }),
      color: 'positive',
      position: 'top',
    });
  } else {
    const created = addTable(data);
    void onFocusTableInMap(created.tableId);
    $q.notify({
      message: t('tables.tableCreatedSuccess', { number: created.tableNumber }),
      color: 'positive',
      position: 'top',
    });
  }
};

const onDeleteTable = (tableId: number): void => {
  const target = tables.value.find((t) => t.tableId === tableId);
  const num = target?.tableNumber || `${tableId}`;
  deleteTable(tableId);
  $q.notify({
    message: t('tables.tableDeletedSuccess', { number: num }),
    color: 'positive',
    position: 'top',
  });
};

const onShowQr = (table: TableManagementItem): void => {
  selectedQrTable.value = table;
  isQrDialogOpen.value = true;
};

const onUpdateTableStatus = (table: TableManagementItem, status: TableStatus): void => {
  updateTable(table.tableId, { status });
  $q.notify({
    message: t('tables.statusUpdateSuccess', {
      number: table.tableNumber,
      status: t(`tables.status.${status}`),
    }),
    color: 'positive',
    position: 'top',
  });
};

const onExpandMap = (): void => {
  isMapExpanded.value = true;
};
</script>

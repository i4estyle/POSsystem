<template>
  <q-page class="stock-page">
    <section class="pos-sales-layout stock-layout">
      <PosSidebarNav @new-order="notifyNewOrder" />
      <main class="pos-main-wrapper stock-main">
        <PosHeaderBar />

        <section class="stock-content">
          <header class="stock-header">
            <div>
              <h1>{{ t('stock.title') }}</h1>
              <small>{{ t('stock.subtitle', { branch: currentBranchName }) }}</small>
            </div>
            <button type="button" class="action-btn" @click="openAddDialog">
              <q-icon name="add" size="20px" />
              <span>{{ t('stock.addStockItem') }}</span>
            </button>
          </header>

          <div class="stock-toolbar">
            <div class="filter-pills">
              <button
                v-for="filter in filters"
                :key="filter.id"
                type="button"
                :class="{ active: stockStore.statusFilter === filter.id }"
                @click="stockStore.statusFilter = filter.id"
              >
                {{ t(filter.labelKey) }}
              </button>
            </div>
          </div>

          <StockDataTable :items="tableRows" @edit="openEditDialog" @restock="onAdjustQty" />
        </section>
      </main>
    </section>

    <!-- Stock Form Dialog -->
    <StockFormDialog v-model="showFormModal" :item="editingItem" @save="onSaveStock" />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { useStockStore, type StockItem } from '@/stores/stock-store';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import StockDataTable, {
  type StockItem as TableStockItem,
} from '@/components/stock/stock-data-table.vue';
import StockFormDialog from '@/components/stock/stock-form-dialog.vue';

const $q = useQuasar();
const { t } = useI18n();
const authStore = useAuthStore();
const stockStore = useStockStore();

const showFormModal = ref(false);
const editingItem = ref<StockItem | null>(null);

const currentBranchName = computed(
  () =>
    authStore.currentUser?.branchName ||
    authStore.currentUser?.branch?.branchName ||
    'สาขาหลัก (Main Branch)',
);

const filters = [
  { id: 'all', labelKey: 'stock.filters.all' },
  { id: 'normal', labelKey: 'stock.filters.inStock' },
  { id: 'low', labelKey: 'stock.filters.lowStock' },
  { id: 'out_of_stock', labelKey: 'stock.filters.outOfStock' },
];

const tableRows = computed<TableStockItem[]>(() =>
  stockStore.filteredStock.map((s) => ({
    ...s,
    sku: s.code,
    statusKey:
      s.status === 'normal'
        ? 'stock.status.inStock'
        : s.status === 'low'
          ? 'stock.status.lowStock'
          : 'stock.status.outOfStock',
    statusClass:
      s.status === 'normal' ? 'in-stock' : s.status === 'low' ? 'low-stock' : 'out-of-stock',
  })),
);

const openAddDialog = (): void => {
  editingItem.value = null;
  showFormModal.value = true;
};

const openEditDialog = (item: TableStockItem): void => {
  editingItem.value = stockStore.stockItems.find((s) => s.id === Number(item.id)) || null;
  showFormModal.value = true;
};

const onSaveStock = (
  payload: Omit<StockItem, 'id' | 'lastUpdated' | 'status'> | Partial<StockItem>,
): void => {
  if (editingItem.value) {
    stockStore.updateStockItem(editingItem.value.id, payload);
    $q.notify({
      type: 'positive',
      message: t('settings.saveSuccess'),
      position: 'top',
    });
  } else {
    stockStore.addStockItem(payload as Omit<StockItem, 'id' | 'lastUpdated' | 'status'>);
    $q.notify({
      type: 'positive',
      message: t('stock.addSuccess'),
      position: 'top',
    });
  }
};

const onAdjustQty = (item: TableStockItem): void => {
  $q.dialog({
    title: t('stock.adjustQtyTitle'),
    message: t('stock.adjustQtyMessage', { name: item.name }),
    prompt: {
      model: '10',
      type: 'number',
    },
    cancel: true,
    persistent: true,
  }).onOk((val: string) => {
    const delta = parseInt(val, 10);
    const itemId = Number(item.id);
    if (!isNaN(delta) && delta !== 0 && !isNaN(itemId)) {
      stockStore.adjustQuantity(itemId, delta);
      $q.notify({
        type: 'positive',
        message: t('stock.adjustQtySuccess', { delta: `${delta > 0 ? '+' : ''}${delta}` }),
        position: 'top',
      });
    }
  });
};

const notifyNewOrder = (): void => {
  $q.notify({ message: t('orders.newOrderPending'), color: 'primary', position: 'top' });
};
</script>

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
            <button type="button" class="action-btn" @click="onAddProduct">
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
                :class="{ active: activeFilter === filter.id }"
                @click="activeFilter = filter.id"
              >
                {{ t(filter.labelKey) }}
              </button>
            </div>
          </div>

          <StockDataTable :items="filteredStock" @edit="onEditItem" @restock="onRestockItem" />
        </section>
      </main>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { useSearchState } from '@/composables/use-search-state';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import StockDataTable, { type StockItem } from '@/components/stock/stock-data-table.vue';

const $q = useQuasar();
const { t } = useI18n();
const authStore = useAuthStore();
const { searchQuery } = useSearchState();

const activeFilter = ref('all');

const currentBranchName = computed(
  () =>
    authStore.currentUser?.branchName ||
    authStore.currentUser?.branch?.branchName ||
    'Downtown Branch',
);

const filters = [
  { id: 'all', labelKey: 'stock.filters.all' },
  { id: 'in-stock', labelKey: 'stock.filters.inStock' },
  { id: 'low-stock', labelKey: 'stock.filters.lowStock' },
  { id: 'out-of-stock', labelKey: 'stock.filters.outOfStock' },
];

const stockItems: StockItem[] = [
  {
    name: 'Espresso Coffee Beans (Arabica 100%)',
    sku: 'BE-COF-001',
    category: 'Coffee Beans',
    quantity: 24.5,
    unit: 'kg',
    statusKey: 'stock.status.inStock',
    statusClass: 'in-stock',
    lastUpdated: '09:30',
  },
  {
    name: 'Fresh Milk (Meiji Whole Milk)',
    sku: 'BE-MLK-002',
    category: 'Dairy',
    quantity: 8,
    unit: 'Liters',
    statusKey: 'stock.status.lowStock',
    statusClass: 'low-stock',
    lastUpdated: '08:15',
  },
  {
    name: 'Organic Lavender Syrup 750ml',
    sku: 'SY-LAV-003',
    category: 'Syrups',
    quantity: 12,
    unit: 'Bottles',
    statusKey: 'stock.status.inStock',
    statusClass: 'in-stock',
    lastUpdated: '16:45',
  },
  {
    name: 'Uji Matcha Powder Grade A',
    sku: 'TE-MTC-004',
    category: 'Tea',
    quantity: 1.2,
    unit: 'kg',
    statusKey: 'stock.status.lowStock',
    statusClass: 'low-stock',
    lastUpdated: '10:00',
  },
  {
    name: 'French AOP Butter Croissant Dough',
    sku: 'BK-CRS-005',
    category: 'Bakery Frozen',
    quantity: 0,
    unit: 'pcs',
    statusKey: 'stock.status.outOfStock',
    statusClass: 'out-of-stock',
    lastUpdated: '18:20',
  },
  {
    name: 'Oat Milk (Barista Edition)',
    sku: 'BE-OAT-006',
    category: 'Dairy Alternative',
    quantity: 18,
    unit: 'Liters',
    statusKey: 'stock.status.inStock',
    statusClass: 'in-stock',
    lastUpdated: '07:45',
  },
];

const filteredStock = computed(() =>
  stockItems.filter((item) => {
    const matchFilter = activeFilter.value === 'all' || item.statusClass === activeFilter.value;
    const matchSearch =
      !searchQuery.value ||
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchFilter && matchSearch;
  }),
);

const notifyNewOrder = (): void => {
  $q.notify({ message: t('orders.newOrderPending'), color: 'primary', position: 'top' });
};

const onAddProduct = (): void => {
  $q.notify({
    message: t('stock.addStockPending'),
    color: 'primary',
    position: 'top',
  });
};

const onEditItem = (item: StockItem): void => {
  $q.notify({
    message: t('stock.editItem', { name: item.name }),
    color: 'primary',
    position: 'top',
  });
};

const onRestockItem = (item: StockItem): void => {
  $q.notify({
    message: t('stock.viewDetails', { name: item.name }),
    color: 'positive',
    position: 'top',
  });
};
</script>

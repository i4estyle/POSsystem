<template>
  <q-page class="orders-page">
    <section class="pos-sales-layout orders-layout">
      <PosSidebarNav />
      <main class="pos-main-wrapper orders-main">
        <PosHeaderBar />
        <section class="orders-content">
          <header class="titlebar">
            <div>
              <h1>{{ t('orders.title') }}</h1>
              <small>{{ t('orders.subtitle') }}</small>
            </div>
          </header>
          <div class="toolbar">
            <div class="orders-toolbar-actions">
              <OrdersDateSortFilter
                v-model:selected-date="selectedDate"
                v-model:sort-order="sortOrder"
                :formatted-date="formattedDate"
              />
              <q-pagination
                v-if="totalPages > 1"
                v-model="currentPage"
                class="orders-pagination"
                :max="totalPages"
                :max-pages="4"
                boundary-numbers
                direction-links
                color="primary"
                active-color="primary"
                aria-label="Order page navigation"
              />
            </div>
          </div>
          <section class="orders-card-grid" :aria-label="t('orders.boardLabel')">
            <OrderTicket
              v-for="order in displayedOrders"
              :key="order.orderNumber"
              :order="order"
              :format-currency="formatCurrency"
              @print="printOrder"
            />
          </section>
        </section>
      </main>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { useSearchState } from '@/composables/use-search-state';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import OrderTicket from '@/components/orders/order-ticket.vue';
import OrdersDateSortFilter from '@/components/orders/orders-date-sort-filter.vue';
import type { OrderKanbanMockTicket } from '@/types/orders-kanban';
import { useOrderStore } from '@/stores/order-store';

const $q = useQuasar();
const { locale, t } = useI18n();
const orderStore = useOrderStore();
const { searchQuery: globalSearchQuery } = useSearchState();

const { searchQuery, selectedDate, sortOrder, currentPage, paginatedOrders, totalPages } =
  storeToRefs(orderStore);

watch(globalSearchQuery, (newVal) => {
  searchQuery.value = newVal;
});

const formattedDate = computed(() => {
  const [year = 2026, month = 1, day = 1] = selectedDate.value.split('/').map(Number);
  return new Intl.DateTimeFormat(locale.value === 'th' ? 'th-TH' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
});

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat(locale.value === 'th' ? 'th-TH' : 'en-US', {
    style: 'currency',
    currency: 'THB',
    currencyDisplay: 'narrowSymbol',
  }).format(value);

const formatOrderType = (order: OrderKanbanMockTicket): string =>
  t(`orders.orderTypes.${order.orderTypeKey}`);

const formatTableLabel = (order: OrderKanbanMockTicket): string =>
  order.orderTypeKey === 'dineIn'
    ? t('orders.table', { table: order.tableNumber })
    : t('orders.orderTypes.takeaway');

const displayedOrders = computed(() =>
  paginatedOrders.value.map((order) => ({
    status: order.status,
    orderNumber: order.orderNumber,
    time: order.time,
    tableLabel: formatTableLabel(order),
    orderType: formatOrderType(order),
    total: order.total,
    items: order.items.map((item) => ({
      quantity: item.quantity,
      name: t(`orders.items.${item.nameKey}`),
      price: item.price,
    })),
  })),
);

const printOrder = (orderNumber: string): void => {
  $q.notify({
    message: t('orders.printPending', { orderNumber }),
    position: 'top',
    color: 'primary',
  });
};
</script>

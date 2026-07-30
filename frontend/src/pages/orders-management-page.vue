<template>
  <q-page class="orders-page">
    <section class="pos-sales-layout orders-layout order-management-layout">
      <PosSidebarNav />
      <main class="pos-main-wrapper orders-main">
        <PosHeaderBar />
        <section class="orders-content">
          <header class="titlebar">
            <div>
              <h1>{{ t('orders.managementTitle') }}</h1>
              <small>{{ t('orders.managementSubtitle') }}</small>
            </div>
          </header>

          <section class="order-management-board" :aria-label="t('orders.boardLabel')">
            <OrderManagementColumn
              v-for="column in columns"
              :key="column.status"
              :status="column.status"
              :title="column.title"
              :action-label="column.actionLabel"
              :empty-label="emptyLabel"
              :orders="column.orders"
              :format-currency="formatCurrency"
              @advance="advanceOrder"
            />
          </section>
        </section>
      </main>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import OrderManagementColumn from '@/components/orders/order-management-column.vue';
import { useOrderStore } from '@/stores/order-store';
import type { KanbanStatus, OrderKanbanMockTicket, OrderKanbanTicket } from '@/types/orders-kanban';

const { t, locale } = useI18n();
const $q = useQuasar();
const orderStore = useOrderStore();
const { ordersByStatus } = storeToRefs(orderStore);

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat(locale.value === 'th' ? 'th-TH' : 'en-US', {
    style: 'currency',
    currency: 'THB',
    currencyDisplay: 'narrowSymbol',
  }).format(value);

const toTicket = (order: OrderKanbanMockTicket & { status: KanbanStatus }): OrderKanbanTicket => ({
  status: order.status,
  orderNumber: order.orderNumber,
  time: order.time,
  tableLabel:
    order.orderTypeKey === 'dineIn'
      ? t('orders.table', { table: order.tableNumber })
      : t('orders.orderTypes.takeaway'),
  orderType: t(`orders.orderTypes.${order.orderTypeKey}`),
  total: order.total,
  items: order.items.map((item) => ({
    quantity: item.quantity,
    name: t(`orders.items.${item.nameKey}`),
    price: item.price,
  })),
});

const columns = computed(() => [
  {
    status: 'new' as const,
    title: t('orders.statuses.new'),
    actionLabel: t('orders.startOrder'),
    orders: ordersByStatus.value.new.map(toTicket),
  },
  {
    status: 'preparing' as const,
    title: t('orders.statuses.preparing'),
    actionLabel: t('orders.markAsReady'),
    orders: ordersByStatus.value.preparing.map(toTicket),
  },
  {
    status: 'ready' as const,
    title: t('orders.statuses.ready'),
    actionLabel: t('orders.markAsServed'),
    orders: ordersByStatus.value.ready.map(toTicket),
  },
]);

const emptyLabel = computed(() =>
  locale.value === 'th' ? 'ไม่มีออเดอร์ในสถานะนี้' : 'No orders in this status',
);

const advanceOrder = (orderNumber: string): void => {
  const status = orderStore.advanceOrder(orderNumber);
  if (!status) return;

  $q.notify({
    message: t('orders.statusUpdated', { orderNumber, status: t(`orders.statuses.${status}`) }),
    position: 'top',
    color: 'positive',
  });
};
</script>

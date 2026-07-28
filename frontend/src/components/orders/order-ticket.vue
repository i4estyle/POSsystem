<template>
  <article class="order-ticket">
    <div class="ticket-head">
      <div>
        <strong>{{ order.tableLabel }}</strong>
        <small>{{ order.orderType }}</small>
      </div>
      <div class="ticket-time">
        <time>{{ order.time }}</time
        ><small>{{ order.orderNumber }}</small>
      </div>
    </div>
    <div class="line" />
    <ul class="ticket-items">
      <li v-for="item in order.items" :key="item.name">
        <span>{{ item.quantity }}x {{ item.name }}</span>
        <b>{{ formatCurrency(item.price) }}</b>
      </li>
    </ul>
    <footer class="ticket-footer">
      <strong class="total">{{ formatCurrency(order.total) }}</strong>
    </footer>
    <button type="button" :class="`order-action--${order.status}`" @click="handleAction">
      {{ action.label }}
    </button>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { OrderKanbanTicket } from '@/types/orders-kanban';

const { order, formatCurrency } = defineProps<{
  order: OrderKanbanTicket;
  formatCurrency: (value: number) => string;
}>();

const emit = defineEmits<{
  advance: [orderNumber: string];
  print: [orderNumber: string];
}>();

const { t } = useI18n();

const action = computed(() => {
  const actions = {
    new: { label: t('orders.startOrder') },
    preparing: { label: t('orders.markAsReady') },
    ready: { label: t('orders.markAsServed') },
    served: { label: t('orders.printReceipt') },
  };
  return actions[order.status];
});

const handleAction = (): void => {
  if (order.status === 'served') {
    emit('print', order.orderNumber);
    return;
  }
  emit('advance', order.orderNumber);
};
</script>

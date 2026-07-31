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
      <OrderTicketItem
        v-for="item in order.items"
        :key="item.name"
        :name="item.name"
        :quantity="item.quantity"
        :price="item.price"
        :image-url="item.imageUrl"
        :format-currency="formatCurrency"
      />
    </ul>
    <footer class="ticket-footer">
      <strong class="total">{{ formatCurrency(order.total) }}</strong>
    </footer>
    <button
      type="button"
      class="order-action--completed"
      @click="$emit('print', order.orderNumber)"
    >
      {{ t('orders.printReceipt') }}
    </button>
  </article>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { OrderKanbanTicket } from '@/types/orders-kanban';
import OrderTicketItem from './order-ticket-item.vue';

const { order, formatCurrency } = defineProps<{
  order: OrderKanbanTicket;
  formatCurrency: (value: number) => string;
}>();

defineEmits<{
  print: [orderNumber: string];
}>();

const { t } = useI18n();
</script>

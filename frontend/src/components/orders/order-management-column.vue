<template>
  <section class="order-management-column" :class="`status-${status}`">
    <header class="order-management-column__header">
      <div>
        <span class="order-management-column__indicator" />
        <h2>{{ title }}</h2>
      </div>
      <span class="order-management-column__count">{{ orders.length }}</span>
    </header>

    <div class="order-management-column__tickets">
      <article v-for="order in orders" :key="order.orderNumber" class="order-management-ticket">
        <div class="order-management-ticket__head">
          <div>
            <strong>{{ order.tableLabel }}</strong>
            <small>{{ order.orderType }}</small>
          </div>
          <div>
            <time>{{ order.time }}</time>
            <small>{{ order.orderNumber }}</small>
          </div>
        </div>
        <div class="order-management-ticket__line" />
        <ul>
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
        <strong class="order-management-ticket__total">{{ formatCurrency(order.total) }}</strong>
        <button
          type="button"
          class="order-management-ticket__action"
          @click="$emit('advance', order.orderNumber)"
        >
          {{ actionLabel }}
          <q-icon name="arrow_forward" size="16px" />
        </button>
      </article>
      <p v-if="!orders.length" class="order-management-column__empty">{{ emptyLabel }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { KanbanStatus, OrderKanbanTicket } from '@/types/orders-kanban';
import OrderTicketItem from './order-ticket-item.vue';

defineProps<{
  status: Exclude<KanbanStatus, 'served'>;
  title: string;
  actionLabel: string;
  emptyLabel: string;
  orders: OrderKanbanTicket[];
  formatCurrency: (value: number) => string;
}>();

defineEmits<{ advance: [orderNumber: string] }>();
</script>

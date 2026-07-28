<template>
  <section class="kanban-column" :class="`status-${column.key}`">
    <header>
      <div>
        <i />
        <h2>{{ column.title }}</h2>
      </div>
      <span>{{ column.orders.length }}</span>
    </header>
    <div class="tickets">
      <OrderTicket
        v-for="order in column.orders"
        :key="order.orderNumber"
        :order="order"
        :format-currency="formatCurrency"
        @advance="$emit('advance', $event)"
        @print="$emit('print', $event)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import OrderTicket from './order-ticket.vue';
import type { OrderKanbanColumn } from '@/types/orders-kanban';

defineProps<{
  column: OrderKanbanColumn;
  formatCurrency: (value: number) => string;
}>();

defineEmits<{
  advance: [orderNumber: string];
  print: [orderNumber: string];
}>();
</script>

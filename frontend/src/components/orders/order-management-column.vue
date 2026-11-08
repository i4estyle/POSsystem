<template>
  <section class="order-management-column" :class="`status-${status}`">
    <header class="order-management-column__header">
      <div class="order-management-column__title-group">
        <span class="order-management-column__indicator" />
        <h2>{{ title }}</h2>
      </div>
      <span class="order-management-column__count">{{ orders.length }}</span>
    </header>

    <TransitionGroup tag="div" name="ticket-spring" class="order-management-column__tickets">
      <article v-for="order in orders" :key="order.orderNumber" class="order-management-ticket">
        <div class="order-management-ticket__head">
          <div class="order-management-ticket__table-meta">
            <div class="order-management-ticket__table-row">
              <strong>{{ order.tableLabel }}</strong>
              <span class="order-type-pill" :class="{ qr: order.orderNumber.includes('QR') }">
                {{ order.orderType }}
              </span>
            </div>
            <small class="order-management-ticket__channel">
              <q-icon
                :name="order.orderNumber.includes('QR') ? 'qr_code_2' : 'point_of_sale'"
                size="13px"
              />
              {{ order.orderNumber.includes('QR') ? 'สแกนสั่งที่โต๊ะ' : 'สั่งที่เคาน์เตอร์' }}
            </small>
          </div>
          <div class="order-management-ticket__time-meta">
            <time>{{ order.time }}</time>
          </div>
        </div>

        <div class="order-management-ticket__line" />

        <ul class="order-management-ticket__items">
          <OrderTicketItem
            v-for="(item, idx) in order.items"
            :key="`${item.name}-${idx}`"
            :name="item.name"
            :quantity="item.quantity"
            :price="item.price"
            :image-url="item.imageUrl"
            :format-currency="formatCurrency"
          />
        </ul>

        <div class="order-management-ticket__footer">
          <div
            v-if="
              (order.discountAmount && order.discountAmount > 0) ||
              (order.taxAmount && order.taxAmount > 0)
            "
            class="ticket-price-breakdown compact"
          >
            <div class="breakdown-row">
              <span>รวมค่าอาหาร</span>
              <span>{{ formatCurrency(getItemsSubtotal(order)) }}</span>
            </div>
            <div
              v-if="order.discountAmount && order.discountAmount > 0"
              class="breakdown-row discount"
            >
              <span class="promo-badge-inline">
                <q-icon name="local_offer" size="12px" />
                {{ order.promotionLabel || 'ส่วนลดโปรโมชั่น' }}
              </span>
              <strong>-{{ formatCurrency(order.discountAmount) }}</strong>
            </div>
            <div v-if="order.taxAmount && order.taxAmount > 0" class="breakdown-row">
              <span>VAT 7%</span>
              <span>+{{ formatCurrency(order.taxAmount) }}</span>
            </div>
          </div>

          <div class="order-management-ticket__summary">
            <span>รวม {{ getTotalItemsCount(order) }} รายการ</span>
            <strong class="order-management-ticket__total">
              {{ formatCurrency(order.total) }}
            </strong>
          </div>

          <button
            type="button"
            class="order-management-ticket__action"
            @click="$emit('advance', order.orderNumber)"
          >
            <span>{{ actionLabel }}</span>
            <q-icon name="arrow_forward" size="16px" class="action-arrow" />
          </button>
        </div>
      </article>
    </TransitionGroup>

    <div v-if="!orders.length" class="order-management-column__empty-state">
      <div class="empty-icon-circle">
        <q-icon
          :name="
            status === 'new' ? 'inbox' : status === 'preparing' ? 'soup_kitchen' : 'room_service'
          "
          size="24px"
        />
      </div>
      <p class="order-management-column__empty">{{ emptyLabel }}</p>
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

const getTotalItemsCount = (order: OrderKanbanTicket): number =>
  order.items.reduce((sum, item) => sum + item.quantity, 0);

const getItemsSubtotal = (order: OrderKanbanTicket): number =>
  order.subtotal || order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
</script>

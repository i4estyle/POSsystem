<template>
  <article class="order-ticket">
    <div class="ticket-head">
      <div class="ticket-table-meta">
        <div class="ticket-table-row">
          <strong>{{ order.tableLabel }}</strong>
          <span class="order-type-pill" :class="{ qr: order.orderNumber.includes('QR') }">
            {{ order.orderType }}
          </span>
        </div>
        <small class="ticket-channel">
          <q-icon
            :name="order.orderNumber.includes('QR') ? 'qr_code_2' : 'point_of_sale'"
            size="13px"
          />
          {{ order.orderNumber.includes('QR') ? 'สแกนสั่งที่โต๊ะ' : 'สั่งที่เคาน์เตอร์' }}
        </small>
      </div>
      <div class="ticket-time">
        <time>{{ order.time }}</time>
        <small>{{ order.orderNumber }}</small>
      </div>
    </div>

    <div class="line" />

    <ul class="ticket-items">
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

    <div class="ticket-bottom">
      <div
        v-if="
          (order.discountAmount && order.discountAmount > 0) ||
          (order.taxAmount && order.taxAmount > 0)
        "
        class="ticket-price-breakdown"
      >
        <div class="breakdown-row">
          <span>ยอดรวมค่าอาหาร</span>
          <span>{{ formatCurrency(itemsSubtotal) }}</span>
        </div>
        <div v-if="order.discountAmount && order.discountAmount > 0" class="breakdown-row discount">
          <span class="promo-badge-inline">
            <q-icon name="local_offer" size="12px" />
            {{ order.promotionLabel || `ส่วนลดโปรโมชั่น (-${discountPercent}%)` }}
          </span>
          <strong>-{{ formatCurrency(order.discountAmount) }}</strong>
        </div>
        <div v-if="order.taxAmount && order.taxAmount > 0" class="breakdown-row">
          <span>ภาษีมูลค่าเพิ่ม (VAT 7%)</span>
          <span>+{{ formatCurrency(order.taxAmount) }}</span>
        </div>
      </div>

      <footer class="ticket-footer">
        <span class="ticket-item-count">รวม {{ totalItemsCount }} รายการ</span>
        <strong class="total">{{ formatCurrency(order.total) }}</strong>
      </footer>

      <button
        type="button"
        class="order-action--completed"
        @click="$emit('print', order.orderNumber)"
      >
        <q-icon name="print" size="17px" />
        <span>{{ t('orders.printReceipt') }}</span>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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

const totalItemsCount = computed(() => order.items.reduce((sum, item) => sum + item.quantity, 0));

const itemsSubtotal = computed(
  () => order.subtotal || order.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
);

const discountPercent = computed(() => {
  if (!order.discountAmount || !itemsSubtotal.value) return 0;
  return Math.round((order.discountAmount / itemsSubtotal.value) * 100);
});
</script>

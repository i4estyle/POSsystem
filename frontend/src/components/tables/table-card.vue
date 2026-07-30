<template>
  <article
    :id="`table-card-${table.tableId}`"
    class="table-card"
    :class="[`status-${table.status}`, { 'focused-pulse': isFocused }]"
    @click="emit('focus-table', table.tableId)"
  >
    <header class="table-card-header">
      <section class="table-badge">
        <span class="table-num">{{ formattedTableNumber }}</span>
        <small class="table-tag">{{ t('tables.card.tableLabel') }}</small>
      </section>
      <div class="card-action-group">
        <button
          type="button"
          class="icon-action-btn"
          :title="t('tables.editTable', { number: table.tableNumber })"
          @click.stop="emit('edit-table', table)"
        >
          <q-icon name="edit" size="16px" />
        </button>
        <button
          type="button"
          class="icon-action-btn"
          :title="t('tables.qrDialog.title', { table: table.tableNumber })"
          @click.stop="emit('show-qr', table)"
        >
          <q-icon name="qr_code_2" size="16px" />
        </button>
      </div>
    </header>

    <section class="table-card-body">
      <span class="seats-info">
        <q-icon name="group" size="16px" />
        {{ t('tables.card.seats', { count: table.capacity }) }}
      </span>

      <button
        type="button"
        class="status-dropdown-btn"
        :class="table.status"
        :title="t('tables.card.changeStatus')"
        @click.stop
      >
        <GuidedTooltip
          v-if="showStatusGuide"
          class="status-guide-tooltip"
          :title="t('tables.guides.statusTitle')"
          :message="t('tables.guides.statusMessage')"
          :close-label="t('tables.guides.close')"
          session-key="tables.statusGuide.dismissed"
          placement="bottom-left"
        />
        <span :class="['status-dot', table.status]"></span>
        <span class="status-label">{{ t(`tables.status.${table.status}`) }}</span>

        <q-menu
          anchor="bottom left"
          self="top left"
          class="status-dropdown-menu"
          :offset="[0, 8]"
          transition-show="jump-down"
          transition-hide="jump-up"
        >
          <q-list dense>
            <q-item
              v-for="status in tableStatusFlow"
              :key="status"
              v-close-popup
              clickable
              :active="status === table.status"
              active-class="active-status-option"
              @click.stop="emit('update-status', table, status)"
            >
              <q-item-section avatar class="status-option-avatar">
                <span :class="['status-dot', status]"></span>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t(`tables.status.${status}`) }}</q-item-label>
              </q-item-section>
              <q-item-section v-if="status === table.status" side>
                <q-icon name="check" size="16px" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </button>
    </section>

    <footer class="table-card-footer">
      <section v-if="table.status === 'occupied'" class="occupied-details">
        <span class="detail-col">
          <small class="detail-label">{{ t('tables.card.timeSeated') }}</small>
          <strong class="detail-val text-purple">{{ table.timeSeated || '15m ago' }}</strong>
        </span>
        <span class="detail-col align-right">
          <small class="detail-label">{{ t('tables.card.total') }}</small>
          <strong class="detail-val text-dark">฿{{ formatCurrency(table.totalAmount) }}</strong>
        </span>
      </section>

      <p v-else-if="table.status === 'available'" class="available-desc">
        <em>{{
          table.descriptionKey ? t(table.descriptionKey) : t('tables.card.readyForGuest')
        }}</em>
      </p>

      <section v-else-if="table.status === 'cleaning'" class="cleaning-details">
        <section class="cleaning-bar">
          <span class="cleaning-fill" :style="{ width: `${table.cleaningProgress || 60}%` }"></span>
        </section>
        <small class="cleaning-time">
          {{ t('tables.card.estimatedTime', { time: `${table.estimatedCleaningMinutes || 4}M` }) }}
        </small>
      </section>

      <section v-else-if="table.status === 'reserved'" class="reserved-details">
        <span class="reserved-time">
          <q-icon name="schedule" size="14px" />
          {{ table.reservedTime || '19:30 PM' }}
        </span>
        <strong class="reserved-name">{{ table.reservedName || 'Mr. Guest' }}</strong>
      </section>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { tableStatusFlow, type TableManagementItem, type TableStatus } from '@/types/dining-table';
import GuidedTooltip from '@/components/base/guided-tooltip.vue';

const { t } = useI18n();

const props = defineProps<{
  table: TableManagementItem;
  isFocused?: boolean;
  showStatusGuide?: boolean;
}>();

const emit = defineEmits<{
  (e: 'focus-table', tableId: number): void;
  (e: 'edit-table', table: TableManagementItem): void;
  (e: 'show-qr', table: TableManagementItem): void;
  (e: 'update-status', table: TableManagementItem, status: TableStatus): void;
}>();

const formattedTableNumber = computed((): string => {
  const num = props.table.tableNumber.replace(/^[^\d]*/, '');
  return num.length === 1 ? `0${num}` : num || props.table.tableNumber;
});

const formatCurrency = (val?: number): string => {
  if (val === undefined || val === null) return '0.00';
  return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
</script>

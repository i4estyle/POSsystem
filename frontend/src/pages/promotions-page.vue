<template>
  <q-page class="promotions-page">
    <section class="pos-sales-layout promotions-layout">
      <PosSidebarNav @new-order="notifyNewOrder" />
      <main class="pos-main-wrapper promotions-main">
        <PosHeaderBar />

        <section class="promotions-content">
          <header class="promotions-header">
            <div>
              <h1>{{ t('promotions.title') }}</h1>
              <small>{{ t('promotions.subtitle', { branch: currentBranchName }) }}</small>
            </div>
            <button type="button" class="add-promo-btn" @click="onAddPromotion">
              <q-icon name="add" size="20px" />
              <span>{{ t('promotions.addPromotion') }}</span>
            </button>
          </header>

          <PromotionSummaryCards />

          <div class="promotions-toolbar">
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

          <PromotionDataTable
            :items="filteredPromotions"
            @edit="onEditPromotion"
            @toggle="onTogglePromotion"
          />
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
import PromotionSummaryCards from '@/components/promotions/promotion-summary-cards.vue';
import PromotionDataTable, {
  type PromotionItem,
} from '@/components/promotions/promotion-data-table.vue';

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
  { id: 'all', labelKey: 'promotions.filters.all' },
  { id: 'active', labelKey: 'promotions.filters.active' },
  { id: 'scheduled', labelKey: 'promotions.filters.scheduled' },
  { id: 'expired', labelKey: 'promotions.filters.expired' },
];

const promotionsList = ref<PromotionItem[]>([
  {
    code: 'SUMMER20',
    name: 'Summer Refresh Special 20% Off',
    discount: '20% OFF',
    usage: '142 / 500',
    period: '01/06 - 31/08/2024',
    statusClass: 'active',
    statusKey: 'promotions.status.active',
  },
  {
    code: 'WELCOME50',
    name: 'New Member Welcome Voucher',
    discount: '฿50 OFF',
    usage: '380 / 1000',
    period: '01/01 - 31/12/2024',
    statusClass: 'active',
    statusKey: 'promotions.status.active',
  },
  {
    code: 'BUY1GET1',
    name: 'BOGO Cold Brew Coffee Friday',
    discount: 'Buy 1 Get 1',
    usage: '89 / 200',
    period: '01/07 - 31/07/2024',
    statusClass: 'active',
    statusKey: 'promotions.status.active',
  },
  {
    code: 'MIDMONTH15',
    name: 'Mid-Month Special Discount',
    discount: '15% OFF',
    usage: '0 / 300',
    period: '15/08 - 20/08/2024',
    statusClass: 'scheduled',
    statusKey: 'promotions.status.scheduled',
  },
  {
    code: 'HAPPYHOUR',
    name: 'Afternoon Bakery Combo Deal',
    discount: '฿30 OFF',
    usage: '500 / 500',
    period: '01/05 - 31/05/2024',
    statusClass: 'expired',
    statusKey: 'promotions.status.expired',
  },
]);

const filteredPromotions = computed(() =>
  promotionsList.value.filter((item) => {
    const matchFilter = activeFilter.value === 'all' || item.statusClass === activeFilter.value;
    const q = searchQuery.value.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.code.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.discount.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  }),
);

const notifyNewOrder = (): void => {
  $q.notify({ message: t('orders.newOrderPending'), color: 'primary', position: 'top' });
};

const onAddPromotion = (): void => {
  $q.notify({
    message: t('promotions.addPromotionPending'),
    color: 'primary',
    position: 'top',
  });
};

const onEditPromotion = (item: PromotionItem): void => {
  $q.notify({
    message: t('promotions.editPromotion', { name: item.name }),
    color: 'primary',
    position: 'top',
  });
};

const onTogglePromotion = (item: PromotionItem): void => {
  if (item.statusClass === 'active') {
    item.statusClass = 'expired';
    item.statusKey = 'promotions.status.expired';
  } else {
    item.statusClass = 'active';
    item.statusKey = 'promotions.status.active';
  }
  $q.notify({
    message: t('promotions.toggleSuccess'),
    color: 'positive',
    position: 'top',
  });
};
</script>

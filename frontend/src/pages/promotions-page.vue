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
            <button type="button" class="add-promo-btn" @click="openAddDialog">
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
                :class="{ active: promotionStore.statusFilter === filter.id }"
                @click="promotionStore.statusFilter = filter.id"
              >
                {{ t(filter.labelKey) }}
              </button>
            </div>
          </div>

          <PromotionDataTable
            :items="tableRows"
            @edit="openEditDialog"
            @toggle="onTogglePromotion"
          />
        </section>
      </main>
    </section>

    <!-- Promotion Form Dialog -->
    <PromotionFormDialog v-model="showFormModal" :promo="editingPromo" @save="onSavePromotion" />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { usePromotionStore, type PromotionItem } from '@/stores/promotion-store';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import PromotionSummaryCards from '@/components/promotions/promotion-summary-cards.vue';
import PromotionDataTable, {
  type PromotionItem as TablePromoItem,
} from '@/components/promotions/promotion-data-table.vue';
import PromotionFormDialog from '@/components/promotions/promotion-form-dialog.vue';

const $q = useQuasar();
const { t } = useI18n();
const authStore = useAuthStore();
const promotionStore = usePromotionStore();

const showFormModal = ref(false);
const editingPromo = ref<PromotionItem | null>(null);

const currentBranchName = computed(
  () =>
    authStore.currentUser?.branchName ||
    authStore.currentUser?.branch?.branchName ||
    'สาขาหลัก (Main Branch)',
);

const filters = [
  { id: 'all', labelKey: 'promotions.filters.all' },
  { id: 'active', labelKey: 'promotions.filters.active' },
  { id: 'expired', labelKey: 'promotions.filters.expired' },
];

const tableRows = computed<TablePromoItem[]>(() =>
  promotionStore.filteredPromotions.map((p) => ({
    id: p.id,
    code: p.code,
    name: p.title,
    discount:
      p.discountType === 'percentage' ? `${p.discountValue}% OFF` : `฿${p.discountValue} OFF`,
    usage: `${p.usageCount} รายการ`,
    period: `${p.startDate} - ${p.endDate}`,
    statusClass:
      p.status === 'active' ? 'active' : p.status === 'expired' ? 'expired' : 'scheduled',
    statusKey: p.status === 'active' ? 'promotions.status.active' : 'promotions.status.expired',
    rawPromo: p,
  })),
);

const openAddDialog = (): void => {
  editingPromo.value = null;
  showFormModal.value = true;
};

const openEditDialog = (item: { rawPromo?: PromotionItem; code: string }): void => {
  editingPromo.value =
    item.rawPromo || promotionStore.promotions.find((p) => p.code === item.code) || null;
  showFormModal.value = true;
};

const onSavePromotion = (
  payload: Omit<PromotionItem, 'id' | 'usageCount'> | Partial<PromotionItem>,
): void => {
  if (editingPromo.value) {
    promotionStore.updatePromotion(editingPromo.value.id, payload);
    $q.notify({
      type: 'positive',
      message: t('settings.saveSuccess'),
      position: 'top',
    });
  } else {
    promotionStore.addPromotion(payload as Omit<PromotionItem, 'id' | 'usageCount'>);
    $q.notify({
      type: 'positive',
      message: 'เพิ่มโปรโมชันสำเร็จ',
      position: 'top',
    });
  }
};

const onTogglePromotion = (item: { rawPromo?: PromotionItem; code: string }): void => {
  const p = item.rawPromo || promotionStore.promotions.find((pr) => pr.code === item.code);
  if (p) {
    promotionStore.toggleStatus(p.id);
    $q.notify({
      message: t('promotions.toggleSuccess'),
      color: 'positive',
      position: 'top',
    });
  }
};

const notifyNewOrder = (): void => {
  $q.notify({ message: t('orders.newOrderPending'), color: 'primary', position: 'top' });
};
</script>

<template>
  <q-page class="dashboard-page">
    <section class="pos-sales-layout dashboard-layout">
      <PosSidebarNav @new-order="notifyNewOrder" />
      <main class="pos-main-wrapper dashboard-main">
        <PosHeaderBar :hide-search="true" />

        <section class="dashboard-content">
          <header class="dashboard-titlebar">
            <h1>{{ t('dashboard.title') }}</h1>
            <small>{{ t('dashboard.subtitle', { branch: currentBranchName }) }}</small>
          </header>

          <DashboardSummaryCards />

          <section class="charts-area">
            <DashboardHourlyChart />
            <DashboardDonutChart />
          </section>

          <DashboardTopSellingTable @view-all="onViewAllTopSelling" />
        </section>
      </main>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import DashboardSummaryCards from '@/components/dashboard/dashboard-summary-cards.vue';
import DashboardHourlyChart from '@/components/dashboard/dashboard-hourly-chart.vue';
import DashboardDonutChart from '@/components/dashboard/dashboard-donut-chart.vue';
import DashboardTopSellingTable from '@/components/dashboard/dashboard-top-selling-table.vue';

const $q = useQuasar();
const { t } = useI18n();
const authStore = useAuthStore();

const currentBranchName = computed(
  () =>
    authStore.currentUser?.branchName ||
    authStore.currentUser?.branch?.branchName ||
    'Downtown Branch',
);

const notifyNewOrder = (): void => {
  $q.notify({ message: t('orders.newOrderPending'), color: 'primary', position: 'top' });
};

const onViewAllTopSelling = (): void => {
  $q.notify({
    message: t('dashboard.viewMorePending'),
    color: 'primary',
    position: 'top',
  });
};
</script>

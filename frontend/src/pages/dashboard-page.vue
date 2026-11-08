<template>
  <q-page class="dashboard-page">
    <section class="pos-sales-layout dashboard-layout">
      <PosSidebarNav @new-order="notifyNewOrder" />
      <main class="pos-main-wrapper dashboard-main">
        <PosHeaderBar :hide-search="true" />

        <section class="dashboard-content">
          <header class="dashboard-titlebar">
            <div class="title-info">
              <h1>{{ t('dashboard.title') }}</h1>
              <small>{{ t('dashboard.subtitle', { branch: currentBranchName }) }}</small>
            </div>

            <!-- Filter Toolbar: Date Range -->
            <div class="dashboard-filter-toolbar">
              <!-- Custom Smooth Date Range Switcher -->
              <nav class="custom-date-nav" aria-label="Date range selection">
                <button
                  type="button"
                  class="date-nav-btn"
                  :class="{ active: timePreset === 'today' }"
                  @click="timePreset = 'today'"
                >
                  วันนี้
                </button>
                <button
                  type="button"
                  class="date-nav-btn"
                  :class="{ active: timePreset === 'week' }"
                  @click="timePreset = 'week'"
                >
                  สัปดาห์นี้
                </button>
                <button
                  type="button"
                  class="date-nav-btn"
                  :class="{ active: timePreset === 'month' }"
                  @click="timePreset = 'month'"
                >
                  เดือนนี้
                </button>
                <button
                  type="button"
                  class="date-nav-btn"
                  :class="{ active: timePreset === 'year' }"
                  @click="timePreset = 'year'"
                >
                  ปีนี้
                </button>
                <button
                  type="button"
                  class="date-nav-btn custom-btn"
                  :class="{ active: timePreset === 'custom' }"
                  @click="timePreset = 'custom'"
                >
                  <q-icon name="event" size="14px" class="q-mr-xs" />
                  <span>{{ timePreset === 'custom' ? dateRangeLabel : 'กำหนดเอง' }}</span>
                  <q-popup-proxy v-if="timePreset === 'custom'" cover transition-show="jump-down" transition-hide="jump-up">
                    <q-date v-model="customDateRange" range minimal mask="YYYY-MM-DD">
                      <div class="row items-center justify-end q-gutter-sm q-pa-sm">
                        <q-btn v-close-popup label="ปิด" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </button>
              </nav>
            </div>
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
import { computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { useBranchStore } from '@/stores/branch-store';
import { useDashboardStore } from '@/stores/dashboard-store';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import DashboardSummaryCards from '@/components/dashboard/dashboard-summary-cards.vue';
import DashboardHourlyChart from '@/components/dashboard/dashboard-hourly-chart.vue';
import DashboardDonutChart from '@/components/dashboard/dashboard-donut-chart.vue';
import DashboardTopSellingTable from '@/components/dashboard/dashboard-top-selling-table.vue';

const $q = useQuasar();
const { t } = useI18n();
const authStore = useAuthStore();
const branchStore = useBranchStore();
const dashboardStore = useDashboardStore();

onMounted(() => {
  void branchStore.fetchBranches();
});

const timePreset = computed({
  get: () => dashboardStore.timeFilter,
  set: (val) => {
    dashboardStore.timeFilter = val;
  },
});

const customDateRange = computed({
  get: () => dashboardStore.customDateRange,
  set: (val) => {
    dashboardStore.customDateRange = val;
  },
});

const currentBranchName = computed(() => {
  if (branchStore.selectedBranchId === null) {
    return authStore.isAdmin ? 'ทุกสาขา (All Branches)' : (authStore.currentUser?.branchName || 'สาขาหลัก');
  }
  return branchStore.selectedBranchName;
});

const dateRangeLabel = computed(() => {
  if (typeof customDateRange.value === 'string') {
    return customDateRange.value;
  }
  if (customDateRange.value && customDateRange.value.from && customDateRange.value.to) {
    return `${customDateRange.value.from} ถึง ${customDateRange.value.to}`;
  }
  return 'เลือกช่วงวันที่';
});

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

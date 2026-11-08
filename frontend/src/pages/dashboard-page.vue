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

            <!-- Filter Toolbar: Branch & Date Range -->
            <div class="dashboard-filter-toolbar">
              <!-- Branch Filter (Only for Admin) -->
              <div v-if="authStore.isAdmin" class="filter-item branch-filter">
                <q-select
                  v-model="selectedBranch"
                  :options="branchOptions"
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  dense
                  outlined
                  rounded
                  bg-color="white"
                  class="filter-select"
                >
                  <template #prepend>
                    <q-icon name="store" size="18px" color="primary" />
                  </template>
                </q-select>
              </div>

              <!-- Time Preset Buttons -->
              <div class="time-presets-group">
                <q-btn-toggle
                  v-model="timePreset"
                  toggle-color="primary"
                  flat
                  rounded
                  dense
                  class="preset-toggle"
                  :options="[
                    { label: 'วันนี้', value: 'today' },
                    { label: 'เดือนนี้', value: 'month' },
                    { label: 'ปีนี้', value: 'year' },
                    { label: 'กำหนดเอง', value: 'custom' },
                  ]"
                />
              </div>

              <!-- Custom Date Range Picker Dialog -->
              <div v-if="timePreset === 'custom'" class="custom-date-picker">
                <q-btn
                  flat
                  dense
                  outlined
                  rounded
                  no-caps
                  icon="event"
                  :label="dateRangeLabel"
                  class="date-picker-btn"
                >
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="customDateRange" range minimal mask="YYYY-MM-DD">
                      <div class="row items-center justify-end q-gutter-sm q-pa-sm">
                        <q-btn v-close-popup label="ปิด" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-btn>
              </div>
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
import { computed, ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { useBranchStore } from '@/stores/branch-store';
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

const timePreset = ref<'today' | 'month' | 'year' | 'custom'>('today');
const todayStr = new Date().toISOString().split('T')[0] ?? '';
const customDateRange = ref<{ from: string; to: string } | string>({
  from: todayStr,
  to: todayStr,
});

onMounted(() => {
  void branchStore.fetchBranches();
});

const branchOptions = computed(() => {
  const options = [{ label: 'ทุกสาขา (All Branches)', value: null as number | null }];
  branchStore.activeBranches.forEach((b) => {
    options.push({ label: b.branchName, value: b.branchId });
  });
  return options;
});

const selectedBranch = computed({
  get: () => branchStore.selectedBranchId,
  set: (val: number | null) => branchStore.setSelectedBranchId(val),
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

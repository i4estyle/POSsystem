<template>
  <div class="chart-card">
    <div class="chart-header">
      <div>
        <h3>{{ t('dashboard.hourlyChart.title') }}</h3>
        <small>{{ t('dashboard.hourlyChart.todayDate') }}</small>
      </div>
      <div class="period-toggle">
        <button
          type="button"
          :class="{ active: activePeriod === 'day' }"
          @click="activePeriod = 'day'"
        >
          {{ t('dashboard.hourlyChart.day') }}
        </button>
        <button
          type="button"
          :class="{ active: activePeriod === 'week' }"
          @click="activePeriod = 'week'"
        >
          {{ t('dashboard.hourlyChart.week') }}
        </button>
      </div>
    </div>

    <div class="area-chart-sim">
      <apexchart
        type="area"
        height="220"
        width="100%"
        :options="chartOptions"
        :series="chartSeries"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import VueApexCharts from 'vue3-apexcharts';
import type { ApexOptions } from 'apexcharts';

const apexchart = VueApexCharts;
const { t } = useI18n();
const activePeriod = ref<'day' | 'week'>('day');

const dayCategories = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
const weekCategories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const dayData = [1200, 2400, 4800, 3200, 2900, 1800];
const weekData = [14200, 16800, 19500, 21000, 28400, 34500, 29800];

const chartSeries = computed(() => [
  {
    name: t('dashboard.topSelling.columns.sales'),
    data: activePeriod.value === 'day' ? dayData : weekData,
  },
]);

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: "'Sarabun', 'Plus Jakarta Sans', sans-serif",
    zoom: { enabled: false },
    sparkline: { enabled: false },
  },
  colors: ['#635880'],
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.55,
      opacityTo: 0.05,
      stops: [0, 90, 100],
    },
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: '#eee9ed',
    strokeDashArray: 4,
    padding: { top: 0, right: 10, bottom: 0, left: 10 },
  },
  xaxis: {
    categories: activePeriod.value === 'day' ? dayCategories : weekCategories,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        colors: '#48454e',
        fontSize: '12px',
        fontWeight: 600,
      },
    },
  },
  yaxis: {
    labels: {
      formatter: (val: number) => `฿${val.toLocaleString()}`,
      style: {
        colors: '#79757e',
        fontSize: '11px',
      },
    },
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (val: number) => `฿${val.toLocaleString()}`,
    },
  },
}));
</script>

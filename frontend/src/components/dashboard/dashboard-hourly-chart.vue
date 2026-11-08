<template>
  <div class="chart-card">
    <div class="chart-header">
      <div>
        <h3>{{ dashboardStore.chartTitle }}</h3>
        <small class="chart-sub-text">{{ dashboardStore.chartSubtitle }}</small>
      </div>
      <div class="chart-legends-indicator">
        <span class="legend-item current">
          <span class="legend-dot"></span>
          {{ dashboardStore.currentPeriodLabel }}
        </span>
        <span class="legend-item previous">
          <span class="legend-dot"></span>
          {{ dashboardStore.previousPeriodLabel }}
        </span>
      </div>
    </div>

    <div class="area-chart-sim">
      <apexchart
        type="area"
        height="230"
        width="100%"
        :options="chartOptions"
        :series="chartSeries"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useDashboardStore } from '@/stores/dashboard-store';

const apexchart = VueApexCharts;
const dashboardStore = useDashboardStore();

const chartSeries = computed(() => [
  {
    name: dashboardStore.currentPeriodLabel,
    data: dashboardStore.currentSalesData,
  },
  {
    name: dashboardStore.previousPeriodLabel,
    data: dashboardStore.previousSalesData,
  },
]);

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: "'Sarabun', 'Plus Jakarta Sans', sans-serif",
    zoom: { enabled: false },
    sparkline: { enabled: false },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 600,
    },
  },
  colors: ['#635880', '#c8c2db'],
  stroke: {
    curve: 'smooth',
    width: [3, 2],
    dashArray: [0, 4],
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: [0.45, 0.15],
      opacityTo: [0.03, 0.0],
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
    categories: dashboardStore.chartCategories,
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
  legend: {
    show: false, // We use sleek custom header legend
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (val: number) => `฿${val.toLocaleString()}`,
    },
  },
}));
</script>

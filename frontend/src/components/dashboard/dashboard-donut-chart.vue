<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3>{{ t('dashboard.donutChart.title') }}</h3>
    </div>

    <div class="donut-container">
      <apexchart
        type="donut"
        height="260"
        width="100%"
        :options="chartOptions"
        :series="chartSeries"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import VueApexCharts from 'vue3-apexcharts';
import type { ApexOptions } from 'apexcharts';

const apexchart = VueApexCharts;
const { t } = useI18n();

const chartSeries = [60, 25, 15];

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'donut',
    fontFamily: "'Sarabun', 'Plus Jakarta Sans', sans-serif",
  },
  colors: ['#635880', '#45636b', '#d7e7d3'],
  labels: [
    t('dashboard.donutChart.coffee'),
    t('dashboard.donutChart.bakery'),
    t('dashboard.donutChart.others'),
  ],
  legend: {
    position: 'bottom',
    fontSize: '13px',
    fontWeight: 600,
    labels: {
      colors: '#48454e',
    },
    markers: {
      size: 6,
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${Math.round(val)}%`,
    style: {
      fontSize: '12px',
      fontWeight: '700',
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '68%',
        labels: {
          show: true,
          total: {
            show: true,
            label: t('dashboard.donutChart.beverages'),
            fontSize: '12px',
            fontFamily: "'Sarabun', sans-serif",
            color: '#79757e',
            formatter: () => '85%',
          },
          value: {
            show: true,
            fontSize: '24px',
            fontWeight: '700',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: '#1c1b1e',
            formatter: (val: string) => `${val}%`,
          },
        },
      },
    },
  },
  stroke: {
    colors: ['#fdf8fc'],
    width: 2,
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (val: number) => `${val}%`,
    },
  },
}));
</script>

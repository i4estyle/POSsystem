<template>
  <div class="feedback-stats-grid">
    <div v-for="stat in stats" :key="stat.titleKey" class="feedback-stat-card">
      <div class="stat-title">{{ t(stat.titleKey) }}</div>
      <div class="stat-number">{{ stat.value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface FeedbackStat {
  titleKey: string;
  value: string;
}

const stats = computed<FeedbackStat[]>(() => [
  { titleKey: 'feedback.overallSatisfaction', value: '4.8 / 5.0' },
  { titleKey: 'feedback.totalReviews', value: '342' },
  { titleKey: 'feedback.positiveRatio', value: '94%' },
  { titleKey: 'feedback.responseRate', value: '98%' },
]);
</script>

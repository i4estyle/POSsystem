<template>
  <section class="attendance-history">
    <header>
      <div>
        <h2>{{ title }}</h2>
        <small>{{ subtitle }}</small>
      </div>
      <button type="button" @click="$emit('view-all')">{{ viewAllLabel }}</button>
    </header>

    <div class="attendance-history__items">
      <article v-for="record in records" :key="record.date" class="attendance-history__item">
        <div class="attendance-history__icon" :class="record.status">
          <q-icon :name="record.status === 'day-off' ? 'event_busy' : 'schedule'" size="22px" />
        </div>
        <div class="attendance-history__details">
          <strong>{{ record.date }}</strong>
          <span>{{ record.time }}</span>
        </div>
        <span class="attendance-history__badge" :class="record.status">{{
          record.statusLabel
        }}</span>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface AttendanceHistoryRecord {
  date: string;
  time: string;
  status: 'on-time' | 'late' | 'day-off';
  statusLabel: string;
}

defineProps<{
  title: string;
  subtitle: string;
  viewAllLabel: string;
  records: AttendanceHistoryRecord[];
}>();

defineEmits<{ 'view-all': [] }>();
</script>

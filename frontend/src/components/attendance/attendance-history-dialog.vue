<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card class="attendance-history-dialog">
      <header>
        <div>
          <h2>{{ title }}</h2>
          <p>{{ subtitle }}</p>
        </div>
        <q-btn v-close-popup flat round icon="close" :aria-label="closeLabel" />
      </header>
      <div class="attendance-history-dialog__list">
        <article v-for="record in records" :key="record.id" class="attendance-history-dialog__row">
          <div class="attendance-history__icon" :class="record.status">
            <q-icon :name="record.status === 'day-off' ? 'event_busy' : 'schedule'" size="22px" />
          </div>
          <div>
            <strong>{{ formatDate(record.date) }}</strong>
            <span>{{ formatTime(record) }}</span>
          </div>
          <span class="attendance-history__badge" :class="record.status">{{
            statusLabel(record.status)
          }}</span>
        </article>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { AttendanceRecord, AttendanceStatus } from '@/stores/attendance-store';

defineProps<{
  modelValue: boolean;
  title: string;
  subtitle: string;
  closeLabel: string;
  records: AttendanceRecord[];
  formatDate: (date: string) => string;
  formatTime: (record: AttendanceRecord) => string;
  statusLabel: (status: AttendanceStatus) => string;
}>();

defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

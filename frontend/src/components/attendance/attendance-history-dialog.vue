<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card class="app-dialog-card attendance-history-dialog-card">
      <AppDialogHeader :title="title" :subtitle="subtitle" icon="history" />

      <main class="dialog-body">
        <div class="attendance-history-dialog__list">
          <article
            v-for="record in records"
            :key="record.id"
            class="attendance-history-dialog__row"
          >
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
      </main>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { AttendanceRecord, AttendanceStatus } from '@/stores/attendance-store';
import AppDialogHeader from '@/components/base/app-dialog-header.vue';

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

<style lang="scss">
@use '../../css/variables' as *;

.attendance-history-dialog-card {
  width: 460px;
  max-width: 95vw;
}
</style>

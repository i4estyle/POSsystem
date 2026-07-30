<template>
  <article class="attendance-current-card">
    <div class="attendance-current-card__clock">
      <q-icon name="calendar_month" size="25px" />
      <strong>{{ currentTime }}</strong>
      <span>{{ todayLabel }}</span>
      <small><i /> {{ liveSyncLabel }}</small>
    </div>

    <div class="attendance-current-card__actions">
      <button
        type="button"
        class="attendance-current-card__action check-in"
        @click="$emit('check-in')"
      >
        <span><q-icon name="input" size="30px" /></span>
        <strong>{{ checkInLabel }}</strong>
        <small>{{ checkInHint }}</small>
      </button>
      <button
        type="button"
        class="attendance-current-card__action check-out"
        @click="$emit('check-out')"
      >
        <span><q-icon name="output" size="30px" /></span>
        <strong>{{ checkOutLabel }}</strong>
        <small>{{ checkOutHint }}</small>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  todayLabel: string;
  currentTime: string;
  checkInLabel: string;
  checkOutLabel: string;
  checkInHint: string;
  checkOutHint: string;
  liveSyncLabel: string;
}>();

defineEmits<{ 'check-in': []; 'check-out': [] }>();
</script>

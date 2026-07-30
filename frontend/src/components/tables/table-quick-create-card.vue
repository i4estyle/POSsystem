<template>
  <button type="button" class="quick-create-card" @click="emit('click')">
    <span class="plus-circle">
      <q-icon name="add" size="24px" />
    </span>
    <span class="create-label">{{ t('tables.quickCreate') }}</span>
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>

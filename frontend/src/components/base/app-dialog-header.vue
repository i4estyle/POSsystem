<template>
  <header class="app-dialog-header">
    <div class="header-title-group">
      <div v-if="icon" class="header-icon-badge">
        <q-icon :name="icon" size="22px" />
      </div>
      <div>
        <h2 v-if="title" class="dialog-title">{{ title }}</h2>
        <small v-if="subtitle" class="dialog-subtitle">{{ subtitle }}</small>
        <slot name="title-extra" />
      </div>
    </div>
    <q-btn v-close-popup flat round icon="close" size="md" class="close-btn" />
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  subtitle?: string;
  icon?: string;
}>();
</script>

<template>
  <div class="app-form-field">
    <label v-if="label" class="field-label">{{ label }}</label>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string;
}>();
</script>

<template>
  <button
    type="button"
    class="category-pill-btn"
    :class="{ active: isActive }"
    @click="$emit('select')"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  isActive?: boolean;
}>();

defineEmits<{
  (e: 'select'): void;
}>();
</script>

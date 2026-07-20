<template>
  <router-link :to="to" class="nav-item" :class="{ active: isActive }">
    <q-icon :name="icon" class="nav-icon" />
    <span>{{ label }}</span>
  </router-link>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  icon: string;
  to: string;
  isActive?: boolean;
}>();
</script>

<template>
  <router-link
    :to="to"
    class="nav-item"
    :class="{ active: isActive, collapsed: isCollapsed }"
    :title="isCollapsed ? label : undefined"
  >
    <q-icon :name="icon" class="nav-icon" />
    <span class="nav-label">{{ label }}</span>

    <q-tooltip
      v-if="isCollapsed"
      anchor="center right"
      self="center left"
      :offset="[10, 0]"
      class="nav-tooltip"
    >
      {{ label }}
    </q-tooltip>
  </router-link>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  icon: string;
  to: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}>();
</script>

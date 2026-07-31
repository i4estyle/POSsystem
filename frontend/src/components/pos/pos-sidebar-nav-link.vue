<template>
  <router-link
    :to="to"
    class="nav-item"
    :class="{ active: isActive, collapsed: isCollapsed }"
    @click="hideTooltip"
  >
    <q-icon :name="icon" class="nav-icon" />
    <span class="nav-label">{{ label }}</span>

    <q-tooltip
      v-if="isCollapsed"
      ref="tooltipRef"
      anchor="center right"
      self="center left"
      :offset="[12, 0]"
      class="nav-tooltip"
    >
      {{ label }}
    </q-tooltip>
  </router-link>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { QTooltip } from 'quasar';

defineProps<{
  label: string;
  icon: string;
  to: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}>();

const tooltipRef = ref<QTooltip | null>(null);

const hideTooltip = (): void => {
  tooltipRef.value?.hide();
};
</script>

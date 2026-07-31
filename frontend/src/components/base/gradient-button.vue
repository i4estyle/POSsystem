<template>
  <button
    type="button"
    class="gradient-button"
    :class="variantClass"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <q-icon v-if="icon" :name="icon" size="18px" />
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'accent';
    disabled?: boolean;
  }>(),
  {
    icon: '',
    variant: 'primary',
    disabled: false,
  },
);

defineEmits<{
  (e: 'click'): void;
}>();

const variantClass = computed(() => `btn-${props.variant}`);
</script>

<template>
  <aside v-if="isVisible" class="guided-tooltip" :class="`guided-tooltip--${placement}`">
    <button
      type="button"
      class="guided-tooltip__close"
      :aria-label="closeLabel"
      @click.stop="dismiss"
    >
      <q-icon name="close" size="14px" />
    </button>
    <span class="guided-tooltip__beam"></span>
    <strong class="guided-tooltip__title">{{ title }}</strong>
    <small class="guided-tooltip__message">{{ message }}</small>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    title: string;
    message: string;
    closeLabel: string;
    sessionKey?: string;
    placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }>(),
  {
    placement: 'top-left',
  },
);

const isDismissedInSession = (): boolean => {
  if (!props.sessionKey || typeof window === 'undefined') return false;
  return window.sessionStorage.getItem(props.sessionKey) === 'dismissed';
};

const isVisible = ref(!isDismissedInSession());

const dismiss = (): void => {
  if (props.sessionKey && typeof window !== 'undefined') {
    window.sessionStorage.setItem(props.sessionKey, 'dismissed');
  }
  isVisible.value = false;
};
</script>

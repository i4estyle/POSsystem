<template>
  <article class="system-card">
    <header class="card-icon-wrapper" :class="iconClass">
      <q-icon :name="iconName" />
    </header>

    <h2 class="card-title">{{ title }}</h2>

    <p class="card-desc">{{ description }}</p>

    <button type="button" class="card-action-btn" :class="btnClass" @click="$emit('select')">
      <span>{{ buttonText }}</span>
      <q-icon name="arrow_forward" size="16px" />
    </button>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  type: 'pos' | 'qr';
  title: string;
  description: string;
  buttonText: string;
}>();

defineEmits<{
  (e: 'select'): void;
}>();

const iconName = computed(() => (props.type === 'pos' ? 'point_of_sale' : 'qr_code_scanner'));
const iconClass = computed(() => (props.type === 'pos' ? 'pos-icon' : 'qr-icon'));
const btnClass = computed(() => (props.type === 'pos' ? 'pos-btn' : 'qr-btn'));
</script>

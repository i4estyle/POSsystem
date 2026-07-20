<template>
  <section class="quantity-stepper">
    <button type="button" class="stepper-btn" aria-label="Decrease quantity" @click="decrease">
      −
    </button>
    <span class="stepper-value">{{ modelValue }}</span>
    <button type="button" class="stepper-btn" aria-label="Increase quantity" @click="increase">
      +
    </button>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const decrease = (): void => {
  emit('update:modelValue', props.modelValue - 1);
};

const increase = (): void => {
  emit('update:modelValue', props.modelValue + 1);
};
</script>

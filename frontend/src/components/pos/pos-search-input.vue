<template>
  <section class="search-box">
    <q-icon name="search" class="search-icon" />
    <input
      type="text"
      class="search-input"
      :value="modelValue !== undefined ? modelValue : searchQuery"
      :placeholder="placeholder || searchPlaceholder"
      @input="onInput"
    />
  </section>
</template>

<script setup lang="ts">
import { useSearchState } from '@/composables/use-search-state';

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const { searchQuery, searchPlaceholder } = useSearchState();

const onInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  if (props.modelValue !== undefined) {
    emit('update:modelValue', target.value);
  } else {
    searchQuery.value = target.value;
  }
};
</script>

<style lang="scss" scoped>
@use '../../css/variables' as *;

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 380px;

  .search-icon {
    position: absolute;
    left: 14px;
    font-size: 20px;
    color: $color-text-muted;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    height: 42px;
    padding: 0 16px 0 44px;
    border: 1px solid rgba(208, 195, 241, 0.5);
    border-radius: $radius-full;
    background: #ffffff;
    font: 600 14px $font-family-base;
    color: $color-text-main;
    outline: none;
    transition: all 0.2s ease;

    &::placeholder {
      color: $color-text-muted;
      font-weight: 500;
    }

    &:focus {
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba(99, 88, 128, 0.12);
    }
  }
}
</style>

<template>
  <nav class="category-pills" aria-label="Product categories">
    <CategoryPill
      :label="t('pos.categories.all')"
      :is-active="selectedId === null"
      @select="$emit('select', null)"
    />
    <CategoryPill
      v-for="cat in categories"
      :key="cat.categoryId"
      :label="cat.categoryName"
      :is-active="selectedId === cat.categoryId"
      @select="$emit('select', cat.categoryId)"
    />
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CategoryPill from './category-pill.vue';
import type { CategoryInterface } from '@/types/product';

const { t } = useI18n();

defineProps<{
  categories: CategoryInterface[];
  selectedId: number | null;
}>();

defineEmits<{
  (e: 'select', id: number | null): void;
}>();
</script>

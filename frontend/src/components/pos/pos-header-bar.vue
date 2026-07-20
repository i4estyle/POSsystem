<template>
  <header class="pos-header">
    <PosSearchInput
      :model-value="searchQuery"
      :placeholder="t('pos.searchPlaceholder')"
      @update:model-value="$emit('update:searchQuery', $event)"
    />

    <section class="user-controls">
      <LocaleSwitcher />
      <PosUserInfo />
    </section>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import PosSearchInput from './pos-search-input.vue';
import PosUserInfo from './pos-user-info.vue';
import LocaleSwitcher from '@/components/base/locale-switcher.vue';

const { t } = useI18n();

defineProps<{
  searchQuery: string;
}>();

defineEmits<{
  (e: 'update:searchQuery', value: string): void;
}>();
</script>

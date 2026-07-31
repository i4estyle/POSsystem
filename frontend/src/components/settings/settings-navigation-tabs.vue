<template>
  <nav class="settings-nav-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      class="tab-btn"
      :class="{ active: activeTab === tab.id }"
      @click="emit('update:activeTab', tab.id)"
    >
      <div class="tab-icon-badge">
        <q-icon :name="tab.icon" size="20px" />
      </div>
      <div class="tab-label-group">
        <span class="tab-title">{{ t(`settings.tabs.${tab.id}`) }}</span>
      </div>
      <q-icon name="chevron_right" size="18px" class="tab-arrow" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

export type SettingsTabId = 'store' | 'hardware' | 'payment' | 'security';

interface Props {
  activeTab: SettingsTabId;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:activeTab', tab: SettingsTabId): void;
}>();

const { t } = useI18n();

const tabs: { id: SettingsTabId; icon: string }[] = [
  { id: 'store', icon: 'storefront' },
  { id: 'hardware', icon: 'print' },
  { id: 'payment', icon: 'payments' },
  { id: 'security', icon: 'shield' },
];
</script>

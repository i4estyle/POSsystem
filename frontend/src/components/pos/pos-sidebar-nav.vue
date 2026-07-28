<template>
  <aside class="pos-sidebar">
    <header class="brand-area">
      <AppLogo
        :show-title="false"
        :subtitle="currentBranchName"
        :image-width="204"
        :image-height="150"
        icon-src="/favicon.ico"
      />
    </header>

    <nav class="nav-list">
      <PosSidebarNavLink
        v-for="item in navItems"
        :key="item.to"
        :label="item.label"
        :icon="item.icon"
        :to="item.to"
        :is-active="item.to === route.path"
      />
    </nav>

    <button type="button" class="new-order-btn" @click="$emit('new-order')">
      <span>{{ t('pos.newOrder') }}</span>
      <q-icon name="add" size="20px" />
    </button>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import AppLogo from '@/components/base/app-logo.vue';
import PosSidebarNavLink from './pos-sidebar-nav-link.vue';

const { t } = useI18n();
const authStore = useAuthStore();
const route = useRoute();

defineEmits<{
  (e: 'new-order'): void;
}>();

const currentBranchName = computed((): string => {
  const user = authStore.currentUser;
  return (
    user?.branchName ||
    user?.branch?.branchName ||
    (user?.branchId ? `สาขา #${user.branchId}` : 'สาขาหลัก')
  );
});

const navItems = computed(() => [
  { label: t('pos.nav.pos'), icon: 'shopping_basket', to: '/pos' },
  { label: t('pos.nav.orders'), icon: 'receipt_long', to: '/orders' },
  { label: t('pos.nav.menu'), icon: 'restaurant_menu', to: '/menu' },
  { label: t('pos.nav.tables'), icon: 'table_restaurant', to: '/tables' },
  { label: t('pos.nav.analytics'), icon: 'bar_chart', to: '/analytics' },
  { label: t('pos.nav.settings'), icon: 'settings', to: '/settings' },
]);
</script>

<template>
  <aside class="pos-sidebar" :class="{ collapsed: isCollapsed }">
    <header class="brand-area">
      <div v-if="isCollapsed" class="collapsed-logo-avatar" title="i4estyle POS">
        <img src="/favicon.ico" alt="Logo" class="collapsed-logo-img" />
      </div>
      <AppLogo
        v-else
        :show-title="false"
        :subtitle="currentBranchName"
        :image-width="204"
        :image-height="130"
        icon-src="/favicon.ico"
      />
    </header>

    <nav class="nav-list">
      <template v-for="item in navItems" :key="item.to">
        <button
          v-if="item.children"
          type="button"
          class="nav-item nav-item--expandable"
          :class="{
            active: item.children.some((child) => child.to === route.path),
            collapsed: isCollapsed,
          }"
          :title="isCollapsed ? item.label : undefined"
          @click="toggleOrders"
        >
          <q-icon :name="item.icon" class="nav-icon" />
          <span class="nav-label">{{ item.label }}</span>
          <q-icon
            v-if="!isCollapsed"
            :name="isOrdersOpen ? 'expand_less' : 'expand_more'"
            class="nav-expand-icon"
          />
        </button>
        <div v-if="item.children && isOrdersOpen && !isCollapsed" class="nav-submenu">
          <PosSidebarNavLink
            v-for="child in item.children"
            :key="child.to"
            :label="child.label"
            :icon="child.icon"
            :to="child.to"
            :is-active="child.to === route.path"
          />
        </div>
        <PosSidebarNavLink
          v-else-if="!item.children"
          :label="item.label"
          :icon="item.icon"
          :to="item.to"
          :is-active="item.to === route.path"
          :is-collapsed="isCollapsed"
        />
      </template>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { useSidebarState } from '@/composables/use-sidebar-state';
import AppLogo from '@/components/base/app-logo.vue';
import PosSidebarNavLink from './pos-sidebar-nav-link.vue';

const { t } = useI18n();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { isCollapsed } = useSidebarState();
const isOrdersOpen = ref(route.path.startsWith('/orders'));

watch(isCollapsed, (collapsed) => {
  if (!collapsed && route.path.startsWith('/orders')) isOrdersOpen.value = true;
});

const toggleOrders = (): void => {
  if (isCollapsed.value) {
    void router.push('/orders/manage');
    return;
  }
  isOrdersOpen.value = !isOrdersOpen.value;
};

const currentBranchName = computed((): string => {
  const user = authStore.currentUser;
  return (
    user?.branchName ||
    user?.branch?.branchName ||
    (user?.branchId ? `สาขา #${user.branchId}` : 'สาขาหลัก')
  );
});

const navItems = computed(() => [
  { label: t('pos.nav.dashboard'), icon: 'dashboard', to: '/dashboard' },
  { label: t('pos.nav.pos'), icon: 'shopping_basket', to: '/pos' },
  {
    label: t('pos.nav.orders'),
    icon: 'receipt_long',
    to: '/orders',
    children: [
      { label: t('pos.nav.orderManagement'), icon: 'dashboard_customize', to: '/orders/manage' },
      { label: t('pos.nav.orderHistory'), icon: 'history', to: '/orders' },
    ],
  },
  { label: t('pos.nav.menu'), icon: 'restaurant_menu', to: '/menu' },
  { label: t('pos.nav.stock'), icon: 'inventory_2', to: '/stock' },
  { label: t('pos.nav.staff'), icon: 'badge', to: '/staff' },
  { label: t('pos.nav.attendance'), icon: 'schedule', to: '/attendance' },
  { label: t('pos.nav.payroll'), icon: 'payments', to: '/payroll' },
  { label: t('pos.nav.feedback'), icon: 'rate_review', to: '/feedback' },
  { label: t('pos.nav.promotions'), icon: 'local_offer', to: '/promotions' },
  { label: t('pos.nav.members'), icon: 'card_membership', to: '/members' },
  { label: t('pos.nav.tables'), icon: 'table_restaurant', to: '/tables' },
  { label: t('pos.nav.settings'), icon: 'settings', to: '/settings' },
]);
</script>

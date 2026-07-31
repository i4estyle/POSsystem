<template>
  <aside class="pos-sidebar" :class="{ collapsed: isCollapsed }">
    <header class="brand-area">
      <div v-if="isCollapsed" class="collapsed-logo-avatar">
        <img src="/favicon.ico" alt="Logo" class="collapsed-logo-img" />
        <q-tooltip anchor="center right" self="center left" :offset="[12, 0]" class="nav-tooltip">
          i4estyle POS
        </q-tooltip>
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
        <!-- Expandable Menu Item (Orders) -->
        <button
          v-if="item.children"
          type="button"
          class="nav-item nav-item--expandable"
          :class="{
            active: item.children.some((child) => child.to === route.path),
            collapsed: isCollapsed,
          }"
          @click="toggleOrders"
        >
          <q-icon :name="item.icon" class="nav-icon" />
          <span class="nav-label">{{ item.label }}</span>
          <q-icon
            v-if="!isCollapsed"
            :name="isOrdersOpen ? 'expand_less' : 'expand_more'"
            class="nav-expand-icon"
          />

          <!-- Tooltip in Collapsed mode - Only when sub-menu is closed -->
          <q-tooltip
            v-if="isCollapsed && !isOrdersMenuOpen"
            anchor="center right"
            self="center left"
            :offset="[12, 0]"
            class="nav-tooltip"
          >
            {{ item.label }}
          </q-tooltip>

          <!-- Sleek Submenu Flyout in Collapsed mode -->
          <q-menu
            v-if="isCollapsed"
            v-model="isOrdersMenuOpen"
            anchor="top right"
            self="top left"
            :offset="[12, 0]"
            class="collapsed-nav-menu"
          >
            <q-list dense class="collapsed-menu-list">
              <q-item
                v-for="child in item.children"
                :key="child.to"
                clickable
                v-close-popup
                class="collapsed-menu-item"
                :class="{ 'is-active': child.to === route.path }"
                @click="router.push(child.to)"
              >
                <q-item-section avatar class="item-icon-sec">
                  <q-icon :name="child.icon" size="18px" />
                </q-item-section>
                <q-item-section class="item-text-sec">
                  {{ child.label }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </button>

        <!-- Submenu links in Expanded mode -->
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

        <!-- Regular Menu Items -->
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
const isOrdersMenuOpen = ref(false);

watch(isCollapsed, (collapsed) => {
  if (!collapsed && route.path.startsWith('/orders')) isOrdersOpen.value = true;
});

const toggleOrders = (): void => {
  if (isCollapsed.value) return;
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

<style lang="scss">
@use '../../css/variables' as *;

.collapsed-nav-menu {
  border-radius: 14px !important;
  background: #ffffff !important;
  box-shadow: 0 10px 30px rgba(99, 88, 128, 0.22) !important;
  border: 1px solid rgba(208, 195, 241, 0.6) !important;
  padding: 6px !important;
  min-width: 185px;

  .collapsed-menu-list {
    .collapsed-menu-item {
      border-radius: 10px;
      padding: 8px 12px;
      color: $color-text-main;
      font-family: 'Sarabun', 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s ease;

      .item-icon-sec {
        min-width: 28px;
        color: $color-primary;
      }

      &:hover {
        background: rgba(208, 195, 241, 0.25);
        color: $color-primary-dark;
      }

      &.is-active {
        background: linear-gradient(135deg, #4a3e68 0%, $color-primary 100%);
        color: #ffffff;

        .item-icon-sec {
          color: #ffffff;
        }
      }
    }
  }
}
</style>

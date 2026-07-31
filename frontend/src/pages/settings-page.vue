<template>
  <q-page class="settings-page">
    <section class="pos-sales-layout settings-layout">
      <PosSidebarNav @new-order="notifyNewOrder" />
      <main class="pos-main-wrapper settings-main">
        <PosHeaderBar />

        <section class="settings-content">
          <header>
            <h1>{{ t('settings.title') }}</h1>
            <small>{{ t('settings.subtitle', { branch: currentBranchName }) }}</small>
          </header>

          <section class="settings-body-grid">
            <SettingsNavigationTabs v-model:active-tab="activeTab" />

            <div class="settings-active-section">
              <SettingsStoreProfile v-if="activeTab === 'store'" />
              <SettingsHardware v-else-if="activeTab === 'hardware'" />
              <SettingsPaymentTax v-else-if="activeTab === 'payment'" />
              <SettingsSecuritySystem v-else-if="activeTab === 'security'" />
            </div>
          </section>
        </section>
      </main>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import SettingsNavigationTabs, {
  type SettingsTabId,
} from '@/components/settings/settings-navigation-tabs.vue';
import SettingsStoreProfile from '@/components/settings/settings-store-profile.vue';
import SettingsHardware from '@/components/settings/settings-hardware.vue';
import SettingsPaymentTax from '@/components/settings/settings-payment-tax.vue';
import SettingsSecuritySystem from '@/components/settings/settings-security-system.vue';

const $q = useQuasar();
const { t } = useI18n();
const authStore = useAuthStore();

const activeTab = ref<SettingsTabId>('store');

const currentBranchName = computed(
  () =>
    authStore.currentUser?.branchName ||
    authStore.currentUser?.branch?.branchName ||
    'Downtown Branch',
);

const notifyNewOrder = (): void => {
  $q.notify({ message: t('orders.newOrderPending'), color: 'primary', position: 'top' });
};
</script>

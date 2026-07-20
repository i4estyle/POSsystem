<template>
  <q-page>
    <main class="system-selection-page">
      <FloatingParticles />

      <section class="main-container">
        <nav class="top-bar">
          <PosUserInfo />
        </nav>

        <header class="header-section">
          <div class="system-logo-wrapper">
            <img src="/favicon.ico" class="system-logo-img" alt="App Logo" />
          </div>
        </header>

        <section class="cards-grid">
          <SystemCard
            type="pos"
            :title="t('systemSelection.posTitle')"
            :description="t('systemSelection.posDesc')"
            :button-text="t('systemSelection.selectButton')"
            @select="navigateToPos"
          />

          <SystemCard
            type="qr"
            :title="t('systemSelection.qrTitle')"
            :description="t('systemSelection.qrDesc')"
            :button-text="t('systemSelection.selectButton')"
            @select="navigateToQr"
          />
        </section>

        <BranchFooter
          :branch-name="currentBranchName"
          :copyright="t('systemSelection.copyright')"
        />
      </section>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth-store';
import FloatingParticles from '@/components/system-selection/floating-particles.vue';
import SystemCard from '@/components/system-selection/system-card.vue';
import BranchFooter from '@/components/system-selection/branch-footer.vue';
import PosUserInfo from '@/components/pos/pos-user-info.vue';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

const currentBranchName = computed((): string => {
  return authStore.currentUser?.branchName || `Branch #${authStore.currentUser?.branchId || 1}`;
});

const navigateToPos = (): void => {
  void router.push('/pos');
};

const navigateToQr = (): void => {
  void router.push('/pos');
};
</script>

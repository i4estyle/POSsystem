<template>
  <section class="settings-card-section">
    <header class="card-header">
      <div class="header-icon-badge">
        <q-icon name="shield" size="22px" />
      </div>
      <div>
        <h3>{{ t('settings.securitySystem.title') }}</h3>
        <small class="sub-text">{{ t('settings.securitySystem.subtitle') }}</small>
      </div>
    </header>

    <div class="settings-form-grid">
      <!-- 1 Single Horizontal Row with 3 Columns -->
      <div class="security-single-row-grid col-span-2">
        <!-- Staff PIN Authorization Policies Sub-card -->
        <div class="sub-card">
          <div class="sub-card-header">
            <div class="header-left-title">
              <q-icon name="lock" size="18px" class="sub-icon" />
              <h4>{{ t('settings.securitySystem.pinPolicy.title') }}</h4>
            </div>
            <span class="status-pulse-badge ready">
              <span class="pulse-dot" />
              Active
            </span>
          </div>
          <div class="sub-card-body flex-column-gap">
            <div class="flex-row-center">
              <q-toggle
                v-model="settingsStore.security.pinPolicy.voidRequirePin"
                color="primary"
                dense
              />
              <span class="toggle-label">{{
                t('settings.securitySystem.pinPolicy.voidRequirePin')
              }}</span>
            </div>

            <div class="flex-row-center">
              <q-toggle
                v-model="settingsStore.security.pinPolicy.discountRequirePin"
                color="primary"
                dense
              />
              <span class="toggle-label">{{
                t('settings.securitySystem.pinPolicy.discountRequirePin')
              }}</span>
            </div>

            <div class="flex-row-center">
              <q-toggle
                v-model="settingsStore.security.pinPolicy.drawerRequirePin"
                color="primary"
                dense
              />
              <span class="toggle-label">{{
                t('settings.securitySystem.pinPolicy.drawerRequirePin')
              }}</span>
            </div>
          </div>
        </div>

        <!-- Auto Lock Screen Sub-card -->
        <div class="sub-card">
          <div class="sub-card-header">
            <div class="header-left-title">
              <q-icon name="timer" size="18px" class="sub-icon" />
              <h4>{{ t('settings.securitySystem.autoLock.title') }}</h4>
            </div>
            <span class="status-pulse-badge ready">
              <span class="pulse-dot" />
              Auto
            </span>
          </div>
          <div class="sub-card-body flex-column-gap">
            <div class="form-group">
              <label class="form-label">{{ t('settings.securitySystem.autoLock.timeout') }}</label>
              <q-select
                v-model="settingsStore.security.autoLock.timeout"
                :options="timeoutOptions"
                emit-value
                map-options
                outlined
                dense
                options-dense
                class="custom-input"
              />
            </div>
          </div>
        </div>

        <!-- Cloud Sync & Data Backup Sub-card -->
        <div class="sub-card">
          <div class="sub-card-header">
            <div class="header-left-title">
              <q-icon name="cloud_sync" size="18px" class="sub-icon" />
              <h4>{{ t('settings.securitySystem.backup.title') }}</h4>
            </div>
            <span class="status-pulse-badge connected">
              <span class="pulse-dot" />
              Synced
            </span>
          </div>
          <div class="sub-card-body flex-column-gap">
            <div class="flex-row-center">
              <q-toggle v-model="settingsStore.security.backup.cloudSync" color="primary" dense />
              <span class="toggle-label">{{ t('settings.securitySystem.backup.cloudSync') }}</span>
            </div>

            <button type="button" class="action-pill-btn" @click="onExportBackup">
              <q-icon name="download" size="14px" />
              <span>{{ t('settings.securitySystem.backup.exportBackup') }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="form-actions col-span-2 space-between-actions">
        <button type="button" class="reset-defaults-btn" @click="onResetDefaults">
          <q-icon name="restart_alt" size="16px" />
          <span>{{ t('settings.resetDefaultsBtn') }}</span>
        </button>

        <button type="button" class="save-btn" @click="onSave">
          <q-icon name="check" size="16px" />
          <span>{{ t('settings.saveButton') }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '@/stores/settings-store';

const $q = useQuasar();
const { t } = useI18n();
const settingsStore = useSettingsStore();

const timeoutOptions = computed(() => [
  { label: t('settings.securitySystem.autoLock.never'), value: 'never' },
  { label: t('settings.securitySystem.autoLock.minutes5'), value: 'minutes5' },
  { label: t('settings.securitySystem.autoLock.minutes10'), value: 'minutes10' },
  { label: t('settings.securitySystem.autoLock.minutes15'), value: 'minutes15' },
]);

const onExportBackup = (): void => {
  $q.notify({
    message: t('settings.securitySystem.backup.exportSuccess'),
    color: 'primary',
    position: 'top',
  });
};

const onResetDefaults = (): void => {
  settingsStore.resetToDefaults();
  $q.notify({
    message: t('settings.resetSuccess'),
    color: 'warning',
    position: 'top',
  });
};

const onSave = (): void => {
  $q.notify({
    message: t('settings.saveSuccess'),
    color: 'positive',
    position: 'top',
  });
};
</script>

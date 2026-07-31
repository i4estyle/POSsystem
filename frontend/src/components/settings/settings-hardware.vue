<template>
  <section class="settings-card-section">
    <header class="card-header">
      <div class="header-icon-badge">
        <q-icon name="print" size="22px" />
      </div>
      <div>
        <h3>{{ t('settings.hardware.title') }}</h3>
        <small class="sub-text">{{ t('settings.hardware.subtitle') }}</small>
      </div>
    </header>

    <div class="settings-form-grid">
      <!-- Thermal Printers Section -->
      <div class="sub-card col-span-2">
        <div class="sub-card-header">
          <div class="header-left-title">
            <q-icon name="receipt_long" size="18px" class="sub-icon" />
            <h4>{{ t('settings.hardware.printer.title') }}</h4>
          </div>
          <button type="button" class="action-pill-btn" @click="openAddPrinterModal">
            <q-icon name="add" size="14px" />
            <span>{{ t('settings.hardware.printer.addPrinter') }}</span>
          </button>
        </div>

        <div class="printers-list">
          <div
            v-for="p in settingsStore.hardware.printers"
            :key="p.id"
            class="printer-item-card"
            :class="{ default: p.isDefault }"
          >
            <div class="printer-info">
              <div class="printer-name-row">
                <span class="printer-name">{{ p.name }}</span>
                <span v-if="p.isDefault" class="default-badge">{{
                  t('settings.hardware.printer.defaultBadge')
                }}</span>
                <span class="status-pulse-badge connected">
                  <span class="pulse-dot" />
                  {{ p.ipAddress }}
                </span>
              </div>
              <div class="printer-meta">
                <span>{{ p.type }}</span> • <span>{{ p.paperWidth }}</span>
              </div>
            </div>

            <div class="printer-actions">
              <button
                v-if="!p.isDefault"
                type="button"
                class="action-pill-btn"
                :title="t('settings.hardware.printer.setDefault')"
                @click="settingsStore.setDefaultPrinter(p.id)"
              >
                {{ t('settings.hardware.printer.setDefault') }}
              </button>
              <button type="button" class="action-pill-btn" @click="onTestPrinter(p.name)">
                <q-icon name="print" size="14px" />
                <span>{{ t('settings.hardware.printer.test') }}</span>
              </button>
              <button
                type="button"
                class="icon-delete-btn"
                :title="t('settings.hardware.printer.delete')"
                @click="settingsStore.deletePrinter(p.id)"
              >
                <q-icon name="delete_outline" size="16px" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cash Drawer Sub-card -->
      <div class="sub-card">
        <div class="sub-card-header">
          <div class="header-left-title">
            <q-icon name="point_of_sale" size="18px" class="sub-icon" />
            <h4>{{ t('settings.hardware.cashDrawer.title') }}</h4>
          </div>
          <span class="status-pulse-badge ready">
            <span class="pulse-dot" />
            Ready
          </span>
        </div>
        <div class="sub-card-body flex-column-gap">
          <div class="flex-row-center">
            <q-toggle v-model="settingsStore.hardware.cashDrawer.autoOpen" color="primary" dense />
            <span class="toggle-label">{{ t('settings.hardware.cashDrawer.autoOpen') }}</span>
          </div>
          <button type="button" class="action-pill-btn" @click="onTestCashDrawer">
            <q-icon name="sensor_door" size="14px" />
            <span>{{ t('settings.hardware.cashDrawer.testButton') }}</span>
          </button>
        </div>
      </div>

      <!-- Customer Display Sub-card -->
      <div class="sub-card">
        <div class="sub-card-header">
          <div class="header-left-title">
            <q-icon name="desktop_windows" size="18px" class="sub-icon" />
            <h4>{{ t('settings.hardware.customerDisplay.title') }}</h4>
          </div>
          <span class="status-pulse-badge ready">
            <span class="pulse-dot" />
            Standby
          </span>
        </div>
        <div class="sub-card-body flex-column-gap">
          <div class="flex-row-center">
            <q-toggle
              v-model="settingsStore.hardware.customerDisplay.enable"
              color="primary"
              dense
            />
            <span class="toggle-label">{{ t('settings.hardware.customerDisplay.enable') }}</span>
          </div>
          <div class="flex-row-center">
            <q-toggle
              v-model="settingsStore.hardware.customerDisplay.slideshow"
              color="primary"
              dense
            />
            <span class="toggle-label">{{ t('settings.hardware.customerDisplay.slideshow') }}</span>
          </div>
        </div>
      </div>

      <div class="form-actions col-span-2">
        <button type="button" class="save-btn" @click="onSave">
          <q-icon name="check" size="16px" />
          <span>{{ t('settings.saveButton') }}</span>
        </button>
      </div>
    </div>

    <!-- Reusable Printer Dialog Component -->
    <SettingsPrinterDialog
      v-model="showPrinterModal"
      :printer="selectedPrinter"
      @save="onSavePrinter"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '@/stores/settings-store';
import type { PrinterConfig } from '@/types/settings';
import SettingsPrinterDialog from './settings-printer-dialog.vue';

const $q = useQuasar();
const { t } = useI18n();
const settingsStore = useSettingsStore();

const showPrinterModal = ref(false);
const selectedPrinter = ref<PrinterConfig | null>(null);

const openAddPrinterModal = (): void => {
  selectedPrinter.value = null;
  showPrinterModal.value = true;
};

const onSavePrinter = (data: Omit<PrinterConfig, 'id'>): void => {
  settingsStore.addPrinter(data);
  $q.notify({
    message: t('settings.hardware.printer.addedSuccess'),
    color: 'positive',
    position: 'top',
  });
};

const onTestPrinter = (name: string): void => {
  $q.notify({
    message: t('settings.hardware.printer.testSuccess', { name }),
    color: 'primary',
    position: 'top',
  });
};

const onTestCashDrawer = (): void => {
  $q.notify({
    message: t('settings.hardware.cashDrawer.testSuccess'),
    color: 'positive',
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

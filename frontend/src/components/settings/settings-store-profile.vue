<template>
  <section class="settings-card-section">
    <header class="card-header">
      <div class="header-icon-badge">
        <q-icon name="storefront" size="22px" />
      </div>
      <div>
        <h3>{{ t('settings.storeProfile.title') }}</h3>
        <small class="sub-text">{{ t('settings.storeProfile.subtitle') }}</small>
      </div>
    </header>

    <form class="settings-form-grid" @submit.prevent="onSave">
      <div class="store-profile-split-grid col-span-2">
        <!-- Form Inputs Column -->
        <div class="profile-inputs-column">
          <div class="form-group">
            <label class="form-label">{{ t('settings.storeProfile.storeName') }}</label>
            <q-input
              v-model="settingsStore.storeProfile.storeName"
              outlined
              dense
              class="custom-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('settings.storeProfile.branchName') }}</label>
            <q-input
              v-model="settingsStore.storeProfile.branchName"
              outlined
              dense
              class="custom-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('settings.storeProfile.taxId') }}</label>
            <q-input
              v-model="settingsStore.storeProfile.taxId"
              outlined
              dense
              class="custom-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('settings.storeProfile.phone') }}</label>
            <q-input
              v-model="settingsStore.storeProfile.phone"
              outlined
              dense
              class="custom-input"
            />
          </div>

          <div class="form-group col-span-2">
            <label class="form-label">{{ t('settings.storeProfile.address') }}</label>
            <q-input
              v-model="settingsStore.storeProfile.address"
              type="textarea"
              rows="2"
              outlined
              dense
              class="custom-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('settings.storeProfile.receiptHeader') }}</label>
            <q-input
              v-model="settingsStore.storeProfile.receiptHeader"
              outlined
              dense
              class="custom-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('settings.storeProfile.receiptFooter') }}</label>
            <q-input
              v-model="settingsStore.storeProfile.receiptFooter"
              outlined
              dense
              class="custom-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('settings.storeProfile.currency') }}</label>
            <q-select
              v-model="settingsStore.storeProfile.currency"
              :options="currencyOptions"
              outlined
              dense
              options-dense
              class="custom-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('settings.storeProfile.language') }}</label>
            <q-select
              v-model="currentLocale"
              :options="languageOptions"
              emit-value
              map-options
              outlined
              dense
              options-dense
              class="custom-input"
              @update:model-value="onLocaleChange"
            />
          </div>
        </div>

        <!-- Live Receipt Thermal Preview Side Card -->
        <div class="thermal-receipt-preview">
          <div class="receipt-header-text">
            {{ settingsStore.storeProfile.storeName || 'Store Name' }}
          </div>
          <div class="receipt-sub-text">
            {{ settingsStore.storeProfile.branchName || 'Branch' }}
          </div>
          <div class="receipt-sub-text">TAX ID: {{ settingsStore.storeProfile.taxId }}</div>
          <div class="receipt-divider" />
          <div class="receipt-sub-text" style="font-weight: 700">
            {{ settingsStore.storeProfile.receiptHeader }}
          </div>
          <div class="receipt-divider" />
          <div class="receipt-item-row">
            <span>1x Iced Latte</span>
            <span>65.00</span>
          </div>
          <div class="receipt-item-row">
            <span>1x Croissant</span>
            <span>85.00</span>
          </div>
          <div class="receipt-divider" />
          <div class="receipt-item-row" style="font-weight: 700">
            <span>TOTAL (VAT Incl.)</span>
            <span>150.00 ฿</span>
          </div>
          <div class="receipt-divider" />
          <div class="receipt-footer-text">{{ settingsStore.storeProfile.receiptFooter }}</div>
        </div>
      </div>

      <div class="form-actions col-span-2">
        <button type="submit" class="save-btn">
          <q-icon name="check" size="16px" />
          <span>{{ t('settings.saveButton') }}</span>
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '@/stores/settings-store';
import { useLocaleSwitcher } from '@/composables/use-locale-switcher';

const $q = useQuasar();
const { t, locale } = useI18n();
const settingsStore = useSettingsStore();
const { setLocale } = useLocaleSwitcher();

const currentLocale = computed({
  get: () => locale.value,
  set: (val: string) => setLocale(val as 'th' | 'en-US'),
});

const currencyOptions = ['THB (฿)', 'USD ($)', 'EUR (€)', 'JPY (¥)'];

const languageOptions = [
  { label: 'ภาษาไทย (TH)', value: 'th' },
  { label: 'English (ENG)', value: 'en-US' },
];

const onLocaleChange = (val: string): void => {
  setLocale(val as 'th' | 'en-US');
};

const onSave = (): void => {
  $q.notify({
    message: t('settings.saveSuccess'),
    color: 'positive',
    position: 'top',
  });
};
</script>

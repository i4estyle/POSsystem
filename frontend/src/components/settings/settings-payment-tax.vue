<template>
  <section class="settings-card-section">
    <header class="card-header">
      <div class="header-icon-badge">
        <q-icon name="payments" size="22px" />
      </div>
      <div>
        <h3>{{ t('settings.paymentTax.title') }}</h3>
        <small class="sub-text">{{ t('settings.paymentTax.subtitle') }}</small>
      </div>
    </header>

    <div class="settings-form-grid">
      <!-- Payment Channels Sub-card -->
      <div class="sub-card col-span-2">
        <div class="sub-card-header">
          <div class="header-left-title">
            <q-icon name="credit_card" size="18px" class="sub-icon" />
            <h4>{{ t('settings.paymentTax.methods.title') }}</h4>
          </div>
          <button type="button" class="action-pill-btn" @click="showAddMethodModal = true">
            <q-icon name="add" size="14px" />
            <span>{{ t('settings.paymentTax.methods.addMethod') }}</span>
          </button>
        </div>

        <div class="payment-methods-grid">
          <div
            v-for="method in settingsStore.paymentTax.methods"
            :key="method.id"
            class="payment-method-item"
            :class="{ enabled: method.isEnabled }"
          >
            <div class="method-info">
              <q-icon :name="method.icon" size="20px" class="method-icon" />
              <span class="method-name">{{ method.name }}</span>
            </div>

            <div class="method-actions">
              <q-toggle
                v-model="method.isEnabled"
                color="primary"
                dense
                @update:model-value="settingsStore.togglePaymentMethod(method.id)"
              />

              <button
                v-if="!['cash', 'promptpay', 'card'].includes(method.id)"
                type="button"
                class="delete-method-btn"
                @click="settingsStore.deletePaymentMethod(method.id)"
              >
                <q-icon name="delete_outline" size="16px" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- PromptPay Dynamic QR Configuration -->
      <div class="sub-card">
        <div class="sub-card-header">
          <div class="header-left-title">
            <q-icon name="qr_code" size="18px" class="sub-icon" />
            <h4>{{ t('settings.paymentTax.promptpay.title') }}</h4>
          </div>
        </div>
        <div class="sub-card-body flex-column-gap">
          <div class="form-group">
            <label class="form-label">{{ t('settings.paymentTax.promptpay.accountNo') }}</label>
            <q-input
              v-model="settingsStore.paymentTax.promptpay.merchantId"
              outlined
              dense
              class="custom-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('settings.paymentTax.promptpay.accountName') }}</label>
            <q-input
              v-model="settingsStore.paymentTax.promptpay.merchantName"
              outlined
              dense
              class="custom-input"
            />
          </div>

          <div class="promptpay-qr-badge">
            <q-icon name="qr_code_2" size="48px" class="qr-placeholder-icon" />
            <small>{{ t('settings.paymentTax.promptpay.qrReady') }}</small>
          </div>
        </div>
      </div>

      <!-- Tax & Service Charge Settings -->
      <div class="sub-card">
        <div class="sub-card-header">
          <div class="header-left-title">
            <q-icon name="receipt" size="18px" class="sub-icon" />
            <h4>{{ t('settings.paymentTax.taxService.title') }}</h4>
          </div>
        </div>
        <div class="sub-card-body flex-column-gap">
          <div class="form-group">
            <label class="form-label">{{ t('settings.paymentTax.taxService.vatRate') }}</label>
            <q-input
              v-model.number="settingsStore.paymentTax.tax.vatRate"
              type="number"
              outlined
              dense
              class="custom-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('settings.paymentTax.taxService.vatType') }}</label>
            <q-select
              v-model="settingsStore.paymentTax.tax.vatType"
              :options="vatTypeOptions"
              emit-value
              map-options
              outlined
              dense
              options-dense
              class="custom-input"
            />
          </div>

          <div class="flex-row-center">
            <q-toggle
              v-model="settingsStore.paymentTax.tax.enableServiceCharge"
              color="primary"
              dense
            />
            <span class="toggle-label">{{
              t('settings.paymentTax.taxService.enableServiceCharge')
            }}</span>
          </div>

          <div v-if="settingsStore.paymentTax.tax.enableServiceCharge" class="form-group">
            <label class="form-label">{{
              t('settings.paymentTax.taxService.serviceCharge')
            }}</label>
            <q-input
              v-model.number="settingsStore.paymentTax.tax.serviceCharge"
              type="number"
              outlined
              dense
              class="custom-input"
            />
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

    <!-- Add Custom Payment Method Dialog -->
    <SettingsPaymentDialog v-model="showAddMethodModal" @confirm="onConfirmAddMethod" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '@/stores/settings-store';
import SettingsPaymentDialog from '@/components/settings/settings-payment-dialog.vue';

const $q = useQuasar();
const { t } = useI18n();
const settingsStore = useSettingsStore();

const showAddMethodModal = ref(false);

const vatTypeOptions = computed(() => [
  { label: t('settings.paymentTax.taxService.vatIncluded'), value: 'included' },
  { label: t('settings.paymentTax.taxService.vatExcluded'), value: 'excluded' },
]);

const onConfirmAddMethod = (name: string): void => {
  settingsStore.addPaymentMethod(name, 'account_balance_wallet');
  showAddMethodModal.value = false;
  $q.notify({
    message: t('settings.paymentTax.methods.addedSuccess'),
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

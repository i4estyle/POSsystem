<template>
  <q-btn-dropdown
    flat
    dense
    no-caps
    class="auth-lang-switch"
    icon="language"
    :label="currentLocaleLabel"
  >
    <q-list dense class="auth-lang-menu">
      <q-item clickable v-close-popup @click="selectLocale('th')">
        <q-item-section>
          <q-item-label>ไทย (TH)</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="selectLocale('en-US')">
        <q-item-section>
          <q-item-label>English (ENG)</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const currentLocaleLabel = computed((): string => {
  return locale.value === 'en-US' ? 'ENG' : 'TH';
});

const selectLocale = (lang: 'th' | 'en-US'): void => {
  locale.value = lang;
  localStorage.setItem('app_locale', lang);
};
</script>

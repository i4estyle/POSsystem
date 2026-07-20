import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MessageLanguages } from '@/boot/i18n';

export function useLocaleSwitcher() {
  const { locale } = useI18n();

  const currentLocale = computed(() => locale.value as MessageLanguages);

  const setLocale = (newLocale: MessageLanguages): void => {
    locale.value = newLocale;
    localStorage.setItem('app_locale', newLocale);
  };

  return {
    currentLocale,
    setLocale,
  };
}

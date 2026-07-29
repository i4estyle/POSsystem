import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const searchQuery = ref('');

export function useSearchState() {
  const route = useRoute();
  const { t } = useI18n();

  watch(
    () => route.path,
    () => {
      searchQuery.value = '';
    },
  );

  const searchPlaceholder = computed<string>(() => {
    const routeName = (route.name as string) || '';
    const routePath = route.path || '';

    if (routeName === 'pos-sales' || routePath.includes('/pos')) {
      return t('search.placeholders.pos');
    }
    if (routeName === 'stock' || routePath.includes('/stock')) {
      return t('search.placeholders.stock');
    }
    if (routeName === 'menu' || routePath.includes('/menu')) {
      return t('search.placeholders.menu');
    }
    if (routeName === 'staff' || routePath.includes('/staff')) {
      return t('search.placeholders.staff');
    }
    if (routeName === 'orders-kanban' || routePath.includes('/orders')) {
      return t('search.placeholders.orders');
    }
    if (routeName === 'salary' || routePath.includes('/payroll')) {
      return t('search.placeholders.salary');
    }
    if (routeName === 'feedback' || routePath.includes('/feedback')) {
      return t('search.placeholders.feedback');
    }
    if (routeName === 'promotions-management' || routePath.includes('/promotions')) {
      return t('search.placeholders.promotions');
    }
    if (routeName === 'members-management' || routePath.includes('/members')) {
      return t('search.placeholders.members');
    }

    return t('search.placeholders.default');
  });

  return {
    searchQuery,
    searchPlaceholder,
  };
}

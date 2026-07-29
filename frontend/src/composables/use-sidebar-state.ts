import { ref } from 'vue';

const STORAGE_KEY = 'pos_sidebar_collapsed';

const getInitialState = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'true';
  } catch {
    return false;
  }
};

const isCollapsed = ref<boolean>(getInitialState());

export function useSidebarState() {
  const toggleCollapse = (): void => {
    isCollapsed.value = !isCollapsed.value;
    try {
      localStorage.setItem(STORAGE_KEY, String(isCollapsed.value));
    } catch {
      // ignore storage write error
    }
  };

  const setCollapsed = (val: boolean): void => {
    isCollapsed.value = val;
    try {
      localStorage.setItem(STORAGE_KEY, String(val));
    } catch {
      // ignore storage write error
    }
  };

  return {
    isCollapsed,
    toggleCollapse,
    setCollapsed,
  };
}

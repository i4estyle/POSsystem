import { ref } from 'vue';
import { diningTableService } from '@/services/dining-table-service';
import type { TableManagementItem } from '@/types/dining-table';
import { DINING_TABLE_MOCKS } from '@/mocks/dining-tables';

export function useDiningTables() {
  const tables = ref<TableManagementItem[]>([...DINING_TABLE_MOCKS]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const fetchTables = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await diningTableService.getAll();
      const list = res && Array.isArray(res.data) ? res.data : [];
      if (list.length > 0) {
        tables.value = list;
      } else {
        tables.value = DINING_TABLE_MOCKS;
      }
    } catch {
      tables.value = DINING_TABLE_MOCKS;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    tables,
    isLoading,
    error,
    fetchTables,
  };
}

import { ref } from 'vue';
import { diningTableService } from '@/services/dining-table-service';
import type { DiningTableInterface } from '@/types/dining-table';

const MOCK_TABLES: DiningTableInterface[] = [
  { tableId: 1, branchId: 1, tableNumber: 'T-01', capacity: 4, status: 'available' },
  { tableId: 2, branchId: 1, tableNumber: 'T-02', capacity: 2, status: 'available' },
  { tableId: 3, branchId: 1, tableNumber: 'T-03', capacity: 6, status: 'occupied' },
  { tableId: 4, branchId: 1, tableNumber: 'T-04', capacity: 4, status: 'available' },
];

export function useDiningTables() {
  const tables = ref<DiningTableInterface[]>([]);
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
        tables.value = MOCK_TABLES;
      }
    } catch {
      tables.value = MOCK_TABLES;
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

import { ref, computed } from 'vue';
import type { TableManagementItem } from '@/types/dining-table';
import { DINING_TABLE_MOCKS } from '@/mocks/dining-tables';

export function useTableManagement() {
  const tables = ref<TableManagementItem[]>([...DINING_TABLE_MOCKS]);
  const currentPage = ref(1);
  const pageSize = ref(7);

  const addTable = (tableData: Partial<TableManagementItem>): TableManagementItem => {
    const newId = tables.value.length ? Math.max(...tables.value.map((t) => t.tableId)) + 1 : 1;
    const status = tableData.status || 'available';
    const newTable: TableManagementItem = {
      tableId: newId,
      branchId: 1,
      tableNumber: tableData.tableNumber || `T-${newId < 10 ? '0' + newId : newId}`,
      capacity: tableData.capacity || 4,
      status,
      ...(status === 'available' ? { descriptionKey: 'tables.card.readyForGuest' } : {}),
    };
    tables.value.push(newTable);
    return newTable;
  };

  const updateTable = (
    tableId: number,
    tableData: Partial<TableManagementItem>,
  ): TableManagementItem | null => {
    const target = tables.value.find((t) => t.tableId === tableId);
    if (!target) return null;

    Object.assign(target, tableData);
    return target;
  };

  const deleteTable = (tableId: number): boolean => {
    const index = tables.value.findIndex((t) => t.tableId === tableId);
    if (index === -1) return false;
    tables.value.splice(index, 1);
    return true;
  };

  const activeOrdersCount = computed(
    () => tables.value.filter((t) => t.status === 'occupied').length,
  );

  const totalRevenue = computed(() =>
    tables.value.reduce((sum, t) => sum + (t.totalAmount || 0), 0),
  );

  const occupancyPercentage = computed(() => {
    if (!tables.value.length) return 0;
    const occupied = tables.value.filter((t) => t.status === 'occupied').length;
    return Math.round((occupied / tables.value.length) * 100);
  });

  return {
    tables,
    currentPage,
    pageSize,
    addTable,
    updateTable,
    deleteTable,
    activeOrdersCount,
    totalRevenue,
    occupancyPercentage,
  };
}

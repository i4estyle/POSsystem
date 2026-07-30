import { ref, computed } from 'vue';
import type { TableManagementItem } from '@/types/dining-table';

const initialTables: TableManagementItem[] = [
  {
    tableId: 1,
    branchId: 1,
    tableNumber: 'T-01',
    capacity: 4,
    status: 'occupied',
    timeSeated: '45m ago',
    totalAmount: 84.5,
  },
  {
    tableId: 2,
    branchId: 1,
    tableNumber: 'T-02',
    capacity: 2,
    status: 'available',
    descriptionKey: 'tables.card.readyForGuest',
  },
  {
    tableId: 3,
    branchId: 1,
    tableNumber: 'T-03',
    capacity: 6,
    status: 'cleaning',
    cleaningProgress: 65,
    estimatedCleaningMinutes: 4,
  },
  {
    tableId: 4,
    branchId: 1,
    tableNumber: 'T-04',
    capacity: 4,
    status: 'reserved',
    reservedTime: '19:30 PM',
    reservedName: 'Mr. Henderson',
  },
  {
    tableId: 5,
    branchId: 1,
    tableNumber: 'T-05',
    capacity: 4,
    status: 'occupied',
    timeSeated: '1h 10m',
    totalAmount: 152.0,
  },
  {
    tableId: 6,
    branchId: 1,
    tableNumber: 'T-06',
    capacity: 8,
    status: 'available',
    descriptionKey: 'tables.card.largeTableReady',
  },
  {
    tableId: 7,
    branchId: 1,
    tableNumber: 'T-07',
    capacity: 2,
    status: 'occupied',
    timeSeated: '12m ago',
    totalAmount: 22.0,
  },
  {
    tableId: 8,
    branchId: 1,
    tableNumber: 'T-08',
    capacity: 4,
    status: 'available',
    descriptionKey: 'tables.card.readyForGuest',
  },
  {
    tableId: 9,
    branchId: 1,
    tableNumber: 'T-09',
    capacity: 2,
    status: 'occupied',
    timeSeated: '30m ago',
    totalAmount: 68.0,
  },
  {
    tableId: 10,
    branchId: 1,
    tableNumber: 'T-10',
    capacity: 6,
    status: 'reserved',
    reservedTime: '20:00 PM',
    reservedName: 'Ms. Davis',
  },
  {
    tableId: 11,
    branchId: 1,
    tableNumber: 'T-11',
    capacity: 4,
    status: 'available',
    descriptionKey: 'tables.card.readyForGuest',
  },
  {
    tableId: 12,
    branchId: 1,
    tableNumber: 'T-12',
    capacity: 2,
    status: 'cleaning',
    cleaningProgress: 80,
    estimatedCleaningMinutes: 2,
  },
  {
    tableId: 13,
    branchId: 1,
    tableNumber: 'T-13',
    capacity: 4,
    status: 'occupied',
    timeSeated: '20m ago',
    totalAmount: 190.5,
  },
  {
    tableId: 14,
    branchId: 1,
    tableNumber: 'T-14',
    capacity: 8,
    status: 'available',
    descriptionKey: 'tables.card.readyForGuest',
  },
  {
    tableId: 15,
    branchId: 1,
    tableNumber: 'T-15',
    capacity: 4,
    status: 'occupied',
    timeSeated: '55m ago',
    totalAmount: 110.0,
  },
  {
    tableId: 16,
    branchId: 1,
    tableNumber: 'T-16',
    capacity: 6,
    status: 'available',
    descriptionKey: 'tables.card.readyForGuest',
  },
];

export function useTableManagement() {
  const tables = ref<TableManagementItem[]>([...initialTables]);
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

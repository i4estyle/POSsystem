import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { TableManagementItem } from '@/types/dining-table';
import { DINING_TABLE_MOCKS } from '@/mocks/dining-tables';
import { orderService } from '@/services/order-service';
import { OrderStatus } from '@/types/order';

export function useTableManagement() {
  const tables = ref<TableManagementItem[]>([...DINING_TABLE_MOCKS]);
  const currentPage = ref(1);
  const pageSize = ref(7);
  let pollInterval: ReturnType<typeof setInterval> | null = null;

  const syncTablesWithLiveOrders = async (): Promise<void> => {
    try {
      const liveOrders = await orderService.findAll(100);
      const tableTotals = new Map<number, { total: number; latestDate: Date }>();

      for (const bo of liveOrders) {
        if (bo.tableId && bo.status !== OrderStatus.PAID && bo.status !== OrderStatus.CANCELLED) {
          const prev = tableTotals.get(bo.tableId);
          const orderDate = bo.orderDate ? new Date(bo.orderDate) : new Date();
          const amt = Number(bo.netAmount || bo.totalAmount || 0);
          if (prev) {
            prev.total += amt;
            if (orderDate < prev.latestDate) prev.latestDate = orderDate;
          } else {
            tableTotals.set(bo.tableId, { total: amt, latestDate: orderDate });
          }
        }
      }

      for (const table of tables.value) {
        const activeInfo = tableTotals.get(table.tableId);
        if (activeInfo) {
          table.status = 'occupied';
          table.totalAmount = Number(activeInfo.total.toFixed(2));
          const diffMins = Math.max(
            1,
            Math.round((Date.now() - activeInfo.latestDate.getTime()) / 60000),
          );
          table.timeSeated =
            diffMins < 60 ? `${diffMins}m ago` : `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;
        } else if (table.status === 'occupied') {
          // If no active orders remain for this table, return to available
          table.status = 'available';
          table.totalAmount = undefined;
          table.timeSeated = undefined;
          table.descriptionKey = 'tables.card.readyForGuest';
        }
      }
    } catch {
      // Offline / fallback
    }
  };

  onMounted(() => {
    void syncTablesWithLiveOrders();
    pollInterval = setInterval(() => {
      void syncTablesWithLiveOrders();
    }, 6000);
  });

  onUnmounted(() => {
    if (pollInterval) clearInterval(pollInterval);
  });

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

    // If staff changes status to available or cleaning, reset active order info on this table
    if (tableData.status && tableData.status !== 'occupied') {
      target.totalAmount = 0;
      target.timeSeated = undefined;

      // Automatically complete active orders for this table in the background
      void orderService
        .findAll(100)
        .then(async (liveOrders) => {
          const tableOrders = liveOrders.filter(
            (bo) =>
              Number(bo.tableId) === Number(tableId) &&
              bo.status !== OrderStatus.PAID &&
              bo.status !== OrderStatus.CANCELLED,
          );
          for (const order of tableOrders) {
            try {
              if (order.status === OrderStatus.PENDING) {
                await orderService.updateStatus(order.orderId, OrderStatus.CANCELLED);
              } else if (order.status === OrderStatus.READY || order.status === OrderStatus.SERVED) {
                await orderService.updateStatus(order.orderId, OrderStatus.PAID);
              } else {
                await orderService.updateStatus(order.orderId, OrderStatus.CANCELLED);
              }
            } catch {
              // Ignore single update failures
            }
          }
        })
        .catch(() => {
          // Ignore offline errors
        });
    }

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

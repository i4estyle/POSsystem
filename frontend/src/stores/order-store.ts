import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { orderKanbanMockColumns } from '@/mocks/orders-kanban';
import type {
  KanbanStatus,
  OrderFilterValue,
  OrderItemKey,
  OrderKanbanMockTicket,
  OrderSortOrder,
} from '@/types/orders-kanban';

type ManagedOrder = OrderKanbanMockTicket & { status: KanbanStatus };

const statusOrder: KanbanStatus[] = ['new', 'preparing', 'ready', 'served'];

const itemSearchTerms: Record<OrderItemKey, string[]> = {
  lavenderLatte: ['lavender latte', 'ลาเวนเดอร์ลาเต้'],
  butterCroissant: ['butter croissant', 'บัตเตอร์ครัวซองต์'],
  kyotoMatchaLatte: ['kyoto matcha latte', 'เกียวโตมัทฉะลาเต้'],
  icedLatte: ['iced latte', 'ลาเต้เย็น'],
  belgianWaffle: ['belgian waffle', 'เบลเยียมวาฟเฟิล'],
  cappuccino: ['cappuccino', 'คาปูชิโน่'],
  avocadoToast: ['avocado toast', 'อะโวคาโดโทสต์'],
  americano: ['americano', 'อเมริกาโน่'],
  matchaLatte: ['matcha latte', 'มัทฉะลาเต้'],
  croissant: ['croissant', 'ครัวซองต์'],
  eggsBenedict: ['eggs benedict', 'เอ็กส์เบเนดิกต์'],
  flatWhite: ['flat white', 'แฟลตไวท์'],
};

export const useOrderStore = defineStore('orders', () => {
  const searchQuery = ref('');
  const selectedStatus = ref<OrderFilterValue>('all');
  const selectedDate = ref('2026/07/20');
  const sortOrder = ref<OrderSortOrder>('newest');
  const currentPage = ref(1);
  const ordersPerPage = 20;
  const orders = ref<ManagedOrder[]>(
    orderKanbanMockColumns.flatMap((column) =>
      column.orders.map((order) => ({
        status: column.key,
        ...order,
      })),
    ),
  );

  const filteredOrders = computed(() => {
    const query = searchQuery.value.trim().toLocaleLowerCase();

    return orders.value
      .filter(
        (order) =>
          (!query ||
            order.orderNumber.toLocaleLowerCase().includes(query) ||
            order.items.some((item) =>
              itemSearchTerms[item.nameKey].some((term) =>
                term.toLocaleLowerCase().includes(query),
              ),
            )) &&
          (selectedStatus.value === 'all' || order.status === selectedStatus.value) &&
          order.createdAt.slice(0, 10).replaceAll('-', '/') === selectedDate.value,
      )
      .sort((first, second) =>
        sortOrder.value === 'newest'
          ? Date.parse(second.createdAt) - Date.parse(first.createdAt)
          : Date.parse(first.createdAt) - Date.parse(second.createdAt),
      );
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredOrders.value.length / ordersPerPage)),
  );

  const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * ordersPerPage;
    return filteredOrders.value.slice(start, start + ordersPerPage);
  });

  const statusCounts = computed<Record<KanbanStatus, number>>(() =>
    statusOrder.reduce<Record<KanbanStatus, number>>(
      (counts, status) => ({
        ...counts,
        [status]: orders.value.filter(
          (order) =>
            order.status === status &&
            order.createdAt.slice(0, 10).replaceAll('-', '/') === selectedDate.value,
        ).length,
      }),
      { new: 0, preparing: 0, ready: 0, served: 0 },
    ),
  );

  const advanceOrder = (orderNumber: string): KanbanStatus | null => {
    const nextStatuses: Record<Exclude<KanbanStatus, 'served'>, KanbanStatus> = {
      new: 'preparing',
      preparing: 'ready',
      ready: 'served',
    };
    const order = orders.value.find((item) => item.orderNumber === orderNumber);

    if (!order || order.status === 'served') return null;

    order.status = nextStatuses[order.status];
    currentPage.value = 1;
    return order.status;
  };

  watch([searchQuery, selectedStatus, selectedDate, sortOrder], () => {
    currentPage.value = 1;
  });

  watch(totalPages, (pageCount) => {
    if (currentPage.value > pageCount) currentPage.value = pageCount;
  });

  return {
    searchQuery,
    selectedStatus,
    selectedDate,
    sortOrder,
    currentPage,
    orders,
    paginatedOrders,
    statusCounts,
    totalPages,
    advanceOrder,
  };
});

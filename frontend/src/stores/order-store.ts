import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { orderService, type BackendOrderDetail } from '@/services/order-service';
import { OrderStatus, OrderType } from '@/types/order';
import type {
  KanbanStatus,
  OrderItemKey,
  OrderKanbanMockItem,
  OrderKanbanMockTicket,
  OrderSortOrder,
} from '@/types/orders-kanban';

export type ManagedOrder = OrderKanbanMockTicket & { status: KanbanStatus };

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

const mapBackendStatusToKanban = (status: OrderStatus): KanbanStatus => {
  switch (status) {
    case OrderStatus.PREPARING:
      return 'preparing';
    case OrderStatus.READY:
      return 'ready';
    case OrderStatus.SERVED:
    case OrderStatus.PAID:
      return 'served';
    default:
      return 'new';
  }
};

const mapKanbanToBackendStatus = (status: KanbanStatus): OrderStatus => {
  switch (status) {
    case 'preparing':
      return OrderStatus.PREPARING;
    case 'ready':
      return OrderStatus.READY;
    case 'served':
      return OrderStatus.SERVED;
    default:
      return OrderStatus.PENDING;
  }
};

const mapBackendOrderToManaged = (bo: BackendOrderDetail): ManagedOrder => {
  const dateObj = bo.orderDate ? new Date(bo.orderDate) : new Date();
  const timeStr = dateObj.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const items: OrderKanbanMockItem[] = (bo.items ?? []).map((it) => {
    const baseName = it.product?.productName || `สินค้า #${it.productId}`;
    const fullName = it.note ? `${baseName} (${it.note})` : baseName;
    return {
      nameKey: 'icedLatte',
      customName: fullName,
      quantity: Number(it.quantity),
      price: Number(it.unitPrice),
      imageUrl:
        it.product?.imageUrl ||
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    };
  });

  const isTakeaway = bo.orderType === OrderType.TAKEAWAY;
  const tableNum = bo.tableId ?? 1;

  const subtotal = Number(
    bo.totalAmount ?? items.reduce((sum, it) => sum + Number(it.price) * Number(it.quantity), 0),
  );
  const discountAmount = Number(bo.discountAmount ?? 0);
  const taxAmount = Number(bo.taxAmount ?? 0);
  const netTotal = Number(bo.netAmount || bo.totalAmount || subtotal);

  let promotionLabel: string | undefined;
  if (bo.promotion) {
    const codePart = bo.promotion.promotionName.split(' - ')[0] || bo.promotion.promotionName;
    const valNum = Number(bo.promotion.discountValue);
    if (bo.promotion.promotionType === 'percent') {
      promotionLabel = `${codePart} (-${valNum}%)`;
    } else {
      promotionLabel = `${codePart} (-฿${valNum.toFixed(0)})`;
    }
  } else if (discountAmount > 0 && subtotal > 0) {
    const pct = Math.round((discountAmount / subtotal) * 100);
    promotionLabel = pct > 0 ? `ส่วนลดโปรโมชั่น (-${pct}%)` : 'ส่วนลดโปรโมชั่น';
  }

  return {
    backendOrderId: bo.orderId,
    status: mapBackendStatusToKanban(bo.status),
    createdAt: dateObj.toISOString(),
    orderNumber: bo.orderNumber.startsWith('#') ? bo.orderNumber : `#${bo.orderNumber}`,
    time: timeStr,
    orderTypeKey: isTakeaway ? 'takeaway' : 'dineIn',
    orderChannel: bo.orderChannel,
    ...(isTakeaway ? {} : { tableNumber: tableNum }),
    subtotal,
    discountAmount,
    taxAmount,
    ...(promotionLabel ? { promotionLabel } : {}),
    total: netTotal,
    items,
  };
};

export const useOrderStore = defineStore('orders', () => {
  const searchQuery = ref('');
  const selectedDate = ref('2026/07/20');
  const sortOrder = ref<OrderSortOrder>('newest');
  const currentPage = ref(1);
  const ordersPerPage = 20;
  const orders = ref<ManagedOrder[]>([]);

  const fetchLiveOrders = async (): Promise<void> => {
    try {
      const liveOrders = await orderService.findAll(50);
      for (const bo of liveOrders) {
        const mapped = mapBackendOrderToManaged(bo);
        const existingIdx = orders.value.findIndex(
          (o) => o.backendOrderId === bo.orderId || o.orderNumber === mapped.orderNumber,
        );
        if (existingIdx >= 0) {
          orders.value[existingIdx] = mapped;
        } else {
          orders.value.unshift(mapped);
        }
      }
    } catch {
      // Offline / fallback mode
    }
  };

  const addLiveTicketLocally = (payload: {
    backendOrderId?: number;
    orderNumber: string;
    tableId?: number | null;
    isTakeaway?: boolean;
    orderChannel?: string;
    subtotal?: number;
    discountAmount?: number;
    taxAmount?: number;
    promotionLabel?: string;
    total: number;
    items: { name: string; quantity: number; price: number; imageUrl?: string | null }[];
  }): void => {
    const formattedNo = payload.orderNumber.startsWith('#')
      ? payload.orderNumber
      : `#${payload.orderNumber}`;
    const existing = orders.value.find((o) => o.orderNumber === formattedNo);
    if (existing) return;

    const now = new Date();
    const calcSubtotal =
      payload.subtotal ?? payload.items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    const ticket: ManagedOrder = {
      ...(payload.backendOrderId ? { backendOrderId: payload.backendOrderId } : {}),
      status: 'new',
      createdAt: now.toISOString(),
      orderNumber: formattedNo,
      time: now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }),
      orderTypeKey: payload.isTakeaway ? 'takeaway' : 'dineIn',
      orderChannel: payload.orderChannel ?? (payload.orderNumber.includes('QR') ? 'qr_order' : 'pos'),
      ...(payload.isTakeaway ? {} : { tableNumber: payload.tableId ?? 1 }),
      subtotal: calcSubtotal,
      discountAmount: payload.discountAmount ?? 0,
      taxAmount: payload.taxAmount ?? 0,
      ...(payload.promotionLabel ? { promotionLabel: payload.promotionLabel } : {}),
      total: payload.total,
      items: payload.items.map((it) => ({
        nameKey: 'icedLatte',
        customName: it.name,
        quantity: it.quantity,
        price: it.price,
        imageUrl: it.imageUrl ?? null,
      })),
    };

    orders.value.unshift(ticket);
  };

  const filteredOrders = computed(() => {
    const query = searchQuery.value.trim().toLocaleLowerCase();

    return orders.value
      .filter(
        (order) =>
          (!query ||
            order.orderNumber.toLocaleLowerCase().includes(query) ||
            order.items.some((item) => {
              if (item.customName?.toLocaleLowerCase().includes(query)) return true;
              return itemSearchTerms[item.nameKey].some((term) =>
                term.toLocaleLowerCase().includes(query),
              );
            })) &&
          order.status === 'served' &&
          (order.backendOrderId !== undefined ||
            order.createdAt.slice(0, 10).replaceAll('-', '/') === selectedDate.value),
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

  const ordersByStatus = computed(() =>
    (['new', 'preparing', 'ready'] as const).reduce(
      (groups, status) => {
        groups[status] = orders.value
          .filter((order) => order.status === status)
          .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt));
        return groups;
      },
      {} as Record<Exclude<KanbanStatus, 'served'>, ManagedOrder[]>,
    ),
  );

  const advanceOrder = (orderNumber: string): KanbanStatus | undefined => {
    const order = orders.value.find((item) => item.orderNumber === orderNumber);
    if (!order) return undefined;

    const nextStatus: Partial<Record<KanbanStatus, KanbanStatus>> = {
      new: 'preparing',
      preparing: 'ready',
      ready: 'served',
    };
    const status = nextStatus[order.status];
    if (!status) return undefined;

    order.status = status;

    if (order.backendOrderId) {
      void orderService
        .updateStatus(order.backendOrderId, mapKanbanToBackendStatus(status))
        .catch(() => {
          // Offline / fallback mode
        });
    }

    return status;
  };

  watch([searchQuery, selectedDate, sortOrder], () => {
    currentPage.value = 1;
  });

  watch(totalPages, (pageCount) => {
    if (currentPage.value > pageCount) currentPage.value = pageCount;
  });

  return {
    searchQuery,
    selectedDate,
    sortOrder,
    currentPage,
    orders,
    paginatedOrders,
    totalPages,
    ordersByStatus,
    advanceOrder,
    fetchLiveOrders,
    addLiveTicketLocally,
  };
});

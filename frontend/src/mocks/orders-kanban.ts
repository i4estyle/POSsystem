import type { OrderKanbanMockColumn, OrderKanbanMockTicket } from '@/types/orders-kanban';
import { getOrderItemImage } from './order-item-images';

const createAdditionalOrders = (
  count: number,
  startNumber: number,
  startMinute: number,
): OrderKanbanMockTicket[] =>
  Array.from({ length: count }, (_, index) => {
    const minute = startMinute - index * 2;
    const hour = 10 + Math.floor(minute / 60);
    const normalizedMinute = ((minute % 60) + 60) % 60;
    const isDineIn = index % 2 === 0;

    return {
      createdAt: `2026-07-20T${String(hour).padStart(2, '0')}:${String(normalizedMinute).padStart(2, '0')}:00`,
      orderNumber: `#${startNumber + index}`,
      time: `${String(hour).padStart(2, '0')}:${String(normalizedMinute).padStart(2, '0')}`,
      orderTypeKey: isDineIn ? 'dineIn' : 'takeaway',
      ...(isDineIn ? { tableNumber: (index % 8) + 1 } : {}),
      total: isDineIn ? 230 : 170,
      items: isDineIn
        ? [
            {
              quantity: 1,
              nameKey: 'lavenderLatte',
              price: 145,
              imageUrl: getOrderItemImage('lavenderLatte'),
            },
            {
              quantity: 1,
              nameKey: 'butterCroissant',
              price: 85,
              imageUrl: getOrderItemImage('butterCroissant'),
            },
          ]
        : [
            {
              quantity: 2,
              nameKey: 'butterCroissant',
              price: 170,
              imageUrl: getOrderItemImage('butterCroissant'),
            },
          ],
    };
  });

export const orderKanbanMockColumns: OrderKanbanMockColumn[] = [
  {
    key: 'new',
    orders: [
      {
        createdAt: '2026-07-20T10:42:00',
        orderNumber: '#1024',
        time: '10:42 AM',
        orderTypeKey: 'dineIn',
        tableNumber: 4,
        total: 230,
        items: [
          {
            quantity: 1,
            nameKey: 'lavenderLatte',
            price: 145,
            imageUrl: getOrderItemImage('lavenderLatte'),
          },
          {
            quantity: 1,
            nameKey: 'butterCroissant',
            price: 85,
            imageUrl: getOrderItemImage('butterCroissant'),
          },
        ],
      },
      {
        createdAt: '2026-07-20T10:48:00',
        orderNumber: '#1025',
        time: '10:48 AM',
        orderTypeKey: 'takeaway',
        total: 170,
        items: [
          {
            quantity: 2,
            nameKey: 'butterCroissant',
            price: 170,
            imageUrl: getOrderItemImage('butterCroissant'),
          },
        ],
      },
      ...createAdditionalOrders(11, 1026, 10),
    ],
  },
  {
    key: 'preparing',
    orders: [
      {
        createdAt: '2026-07-20T10:30:00',
        orderNumber: '#1021',
        time: '10:30 AM',
        orderTypeKey: 'dineIn',
        tableNumber: 2,
        total: 365,
        items: [
          {
            quantity: 1,
            nameKey: 'avocadoToast',
            price: 220,
            imageUrl: getOrderItemImage('avocadoToast'),
          },
          {
            quantity: 1,
            nameKey: 'lavenderLatte',
            price: 145,
            imageUrl: getOrderItemImage('lavenderLatte'),
          },
        ],
      },
      ...createAdditionalOrders(11, 1037, 34),
      {
        createdAt: '2026-07-20T10:35:00',
        orderNumber: '#1022',
        time: '10:35 AM',
        orderTypeKey: 'takeaway',
        total: 250,
        items: [
          {
            quantity: 1,
            nameKey: 'kyotoMatchaLatte',
            price: 165,
            imageUrl: getOrderItemImage('kyotoMatchaLatte'),
          },
          {
            quantity: 1,
            nameKey: 'butterCroissant',
            price: 85,
            imageUrl: getOrderItemImage('butterCroissant'),
          },
        ],
      },
    ],
  },
  {
    key: 'ready',
    orders: [
      {
        createdAt: '2026-07-20T10:18:00',
        orderNumber: '#1019',
        time: '10:18 AM',
        orderTypeKey: 'dineIn',
        tableNumber: 6,
        total: 85,
        items: [
          {
            quantity: 1,
            nameKey: 'butterCroissant',
            price: 85,
            imageUrl: getOrderItemImage('butterCroissant'),
          },
        ],
      },
      ...createAdditionalOrders(12, 1048, 16),
    ],
  },
  {
    key: 'served',
    orders: [
      {
        createdAt: '2026-07-20T10:10:00',
        orderNumber: '#1018',
        time: '10:10 AM',
        orderTypeKey: 'dineIn',
        tableNumber: 1,
        total: 365,
        items: [
          {
            quantity: 1,
            nameKey: 'avocadoToast',
            price: 220,
            imageUrl: getOrderItemImage('avocadoToast'),
          },
          {
            quantity: 1,
            nameKey: 'lavenderLatte',
            price: 145,
            imageUrl: getOrderItemImage('lavenderLatte'),
          },
        ],
      },
      ...createAdditionalOrders(9, 1060, 8),
    ],
  },
];

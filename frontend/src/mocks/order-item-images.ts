import type { OrderItemKey } from '@/types/orders-kanban';

export const ORDER_ITEM_IMAGES: Record<OrderItemKey, string> = {
  lavenderLatte: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80',
  butterCroissant: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',
  kyotoMatchaLatte: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80',
  icedLatte: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80',
  belgianWaffle: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80',
  cappuccino: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80',
  avocadoToast: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&q=80',
  americano: 'https://images.unsplash.com/photo-1514432324607-09a8c3a4f1d1?w=400&q=80',
  matchaLatte: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80',
  croissant: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',
  eggsBenedict: 'https://images.unsplash.com/photo-1608039829572-7851fb4a9632?w=400&q=80',
  flatWhite: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80',
};

export const getOrderItemImage = (nameKey: OrderItemKey): string => ORDER_ITEM_IMAGES[nameKey];

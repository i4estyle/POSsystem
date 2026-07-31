import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface StockItem {
  id: number;
  code: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minLevel: number;
  costPrice: number;
  supplier: string;
  lastUpdated: string;
  status: 'normal' | 'low' | 'out_of_stock';
}

const INITIAL_STOCK: StockItem[] = [
  {
    id: 1,
    code: 'RAW-001',
    name: 'เนื้อวัวบดพรีเมียม (Wagyu Ground Beef)',
    category: 'วัตถุดิบสด',
    quantity: 45,
    unit: 'กก.',
    minLevel: 15,
    costPrice: 280,
    supplier: 'Siam Beef Intertrade',
    lastUpdated: '2026-07-31 08:30',
    status: 'normal',
  },
  {
    id: 2,
    code: 'RAW-002',
    name: 'ผงมัทฉะอุจิแท้ (Uji Matcha Powder)',
    category: 'วัตถุดิบเครื่องดื่ม',
    quantity: 8,
    unit: 'ถุง',
    minLevel: 10,
    costPrice: 450,
    supplier: 'Kyoto Tea Imports',
    lastUpdated: '2026-07-30 16:15',
    status: 'low',
  },
  {
    id: 3,
    code: 'RAW-003',
    name: 'มันฝรั่งแท่งแช่แข็ง (Fries Cut 10mm)',
    category: 'ของแห้ง/แช่แข็ง',
    quantity: 120,
    unit: 'ถุง',
    minLevel: 30,
    costPrice: 85,
    supplier: 'FoodServ Global',
    lastUpdated: '2026-07-31 09:00',
    status: 'normal',
  },
  {
    id: 4,
    code: 'RAW-004',
    name: 'สตรอว์เบอร์รีสด (Fresh Strawberry)',
    category: 'ผลไม้สด',
    quantity: 0,
    unit: 'กก.',
    minLevel: 5,
    costPrice: 220,
    supplier: 'Chiang Mai Fresh Farm',
    lastUpdated: '2026-07-29 11:20',
    status: 'out_of_stock',
  },
  {
    id: 5,
    code: 'RAW-005',
    name: 'นมสดพาสเจอร์ไรส์ (Pasteurized Milk 2L)',
    category: 'วัตถุดิบเครื่องดื่ม',
    quantity: 65,
    unit: 'ขวด',
    minLevel: 20,
    costPrice: 92,
    supplier: 'CP-Meiji Supply',
    lastUpdated: '2026-07-31 07:45',
    status: 'normal',
  },
  {
    id: 6,
    code: 'RAW-006',
    name: 'ซอสมะเขือเทศเข้มข้น (Tomato Ketchup 5kg)',
    category: 'เครื่องปรุง',
    quantity: 12,
    unit: 'แกลลอน',
    minLevel: 5,
    costPrice: 195,
    supplier: 'Heinz Commercial',
    lastUpdated: '2026-07-28 14:00',
    status: 'normal',
  },
];

export const useStockStore = defineStore('stock', () => {
  const stockItems = ref<StockItem[]>(INITIAL_STOCK);
  const searchQuery = ref('');
  const statusFilter = ref<string>('all');

  const filteredStock = computed(() => {
    let result = stockItems.value;

    if (statusFilter.value !== 'all') {
      result = result.filter((item) => item.status === statusFilter.value);
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q),
      );
    }

    return result;
  });

  const lowStockCount = computed(() => stockItems.value.filter((i) => i.status === 'low').length);
  const outOfStockCount = computed(
    () => stockItems.value.filter((i) => i.status === 'out_of_stock').length,
  );

  const calculateStatus = (qty: number, min: number): 'normal' | 'low' | 'out_of_stock' => {
    if (qty <= 0) return 'out_of_stock';
    if (qty <= min) return 'low';
    return 'normal';
  };

  const addStockItem = (item: Omit<StockItem, 'id' | 'lastUpdated' | 'status'>): void => {
    const newId = Math.max(0, ...stockItems.value.map((i) => i.id)) + 1;
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const status = calculateStatus(item.quantity, item.minLevel);

    stockItems.value.unshift({
      ...item,
      id: newId,
      lastUpdated: now,
      status,
    });
  };

  const updateStockItem = (id: number, payload: Partial<StockItem>): void => {
    const item = stockItems.value.find((i) => i.id === id);
    if (item) {
      Object.assign(item, payload);
      item.status = calculateStatus(item.quantity, item.minLevel);
      item.lastUpdated = new Date().toISOString().slice(0, 16).replace('T', ' ');
    }
  };

  const adjustQuantity = (id: number, delta: number): void => {
    const item = stockItems.value.find((i) => i.id === id);
    if (item) {
      item.quantity = Math.max(0, item.quantity + delta);
      item.status = calculateStatus(item.quantity, item.minLevel);
      item.lastUpdated = new Date().toISOString().slice(0, 16).replace('T', ' ');
    }
  };

  const deleteStockItem = (id: number): void => {
    stockItems.value = stockItems.value.filter((i) => i.id !== id);
  };

  return {
    stockItems,
    searchQuery,
    statusFilter,
    filteredStock,
    lowStockCount,
    outOfStockCount,
    addStockItem,
    updateStockItem,
    adjustQuantity,
    deleteStockItem,
  };
});

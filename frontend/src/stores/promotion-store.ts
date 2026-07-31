import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface PromotionItem {
  id: number;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  startDate: string;
  endDate: string;
  usageCount: number;
  status: 'active' | 'inactive' | 'expired';
}

const INITIAL_PROMOTIONS: PromotionItem[] = [
  {
    id: 1,
    code: 'WELCOME10',
    title: 'ส่วนลดต้อนรับสมาชิกใหม่ 10%',
    description: 'รับส่วนลด 10% สำหรับทุกเมนู เมื่อสั่งซื้อขั้นต่ำ 200 บาท',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 200,
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    usageCount: 142,
    status: 'active',
  },
  {
    id: 2,
    code: 'DISCOUNT50',
    title: 'คูปองส่วนลด 50 บาท',
    description: 'ลดทันที 50 บาท เมื่อสั่งเบอร์เกอร์คู่กับเครื่องดื่ม',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 250,
    startDate: '2026-07-15',
    endDate: '2026-08-31',
    usageCount: 89,
    status: 'active',
  },
  {
    id: 3,
    code: 'SUMMER20',
    title: 'Summer Special 20% OFF',
    description: 'ส่วนลดเมนูเครื่องดื่มและของหวาน 20%',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 150,
    startDate: '2026-06-01',
    endDate: '2026-07-15',
    usageCount: 310,
    status: 'expired',
  },
];

export const usePromotionStore = defineStore('promotion', () => {
  const promotions = ref<PromotionItem[]>(INITIAL_PROMOTIONS);
  const searchQuery = ref('');
  const statusFilter = ref('all');

  const filteredPromotions = computed(() => {
    let result = promotions.value;

    if (statusFilter.value !== 'all') {
      result = result.filter((p) => p.status === statusFilter.value);
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.code.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    return result;
  });

  const addPromotion = (data: Omit<PromotionItem, 'id' | 'usageCount'>): void => {
    const newId = Math.max(0, ...promotions.value.map((p) => p.id)) + 1;
    promotions.value.unshift({
      ...data,
      id: newId,
      usageCount: 0,
    });
  };

  const updatePromotion = (id: number, payload: Partial<PromotionItem>): void => {
    const item = promotions.value.find((p) => p.id === id);
    if (item) {
      Object.assign(item, payload);
    }
  };

  const toggleStatus = (id: number): void => {
    const item = promotions.value.find((p) => p.id === id);
    if (item) {
      item.status = item.status === 'active' ? 'inactive' : 'active';
    }
  };

  const deletePromotion = (id: number): void => {
    promotions.value = promotions.value.filter((p) => p.id !== id);
  };

  return {
    promotions,
    searchQuery,
    statusFilter,
    filteredPromotions,
    addPromotion,
    updatePromotion,
    toggleStatus,
    deletePromotion,
  };
});

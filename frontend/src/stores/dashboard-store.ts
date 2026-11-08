import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useBranchStore } from './branch-store';

export interface TopSellingItem {
  rank: number;
  name: string;
  code: string;
  category: string;
  quantitySold: number;
  totalSales: number;
  trend: string;
  trendDir: 'up' | 'down';
  icon: string;
}

export interface SummaryStat {
  todaySales: string;
  todaySalesRaw: number;
  salesTrend: string;
  salesTrendDir: 'up' | 'down';
  totalBills: string;
  billsTrend: string;
  billsTrendDir: 'up' | 'down';
  itemsSold: string;
  itemsTrend: string;
  itemsTrendDir: 'up' | 'down';
  avgPerBill: string;
  avgTrend: string;
  avgTrendDir: 'up' | 'down';
}

export const useDashboardStore = defineStore('dashboard', () => {
  const branchStore = useBranchStore();

  const timeFilter = ref<'today' | 'month' | 'year' | 'custom'>('today');
  const customDateRange = ref<{ from: string; to: string } | string>({
    from: new Date().toISOString().split('T')[0] ?? '',
    to: new Date().toISOString().split('T')[0] ?? '',
  });

  // Mock data generator based on branchId & timeFilter
  // branchId: null = All, 1 = Siam, 2 = Bangsaen, 3 = Chanthaburi
  const branchMultiplier = computed(() => {
    const id = branchStore.selectedBranchId;
    if (id === 1) return 0.5; // Siam
    if (id === 2) return 0.3; // Bangsaen
    if (id === 3) return 0.2; // Chanthaburi
    return 1.0; // All branches
  });

  const timeMultiplier = computed(() => {
    switch (timeFilter.value) {
      case 'month':
        return 28;
      case 'year':
        return 340;
      case 'custom':
        return 7;
      case 'today':
      default:
        return 1;
    }
  });

  const summary = computed<SummaryStat>(() => {
    const bm = branchMultiplier.value;
    const tm = timeMultiplier.value;
    const rawSales = Math.round(18500 * bm * tm);
    const rawBills = Math.round(145 * bm * tm);
    const rawItems = Math.round(290 * bm * tm);
    const avg = rawBills > 0 ? Math.round(rawSales / rawBills) : 0;

    return {
      todaySales: `฿${rawSales.toLocaleString()}`,
      todaySalesRaw: rawSales,
      salesTrend: '+14.2%',
      salesTrendDir: 'up',
      totalBills: rawBills.toLocaleString(),
      billsTrend: '+8.5%',
      billsTrendDir: 'up',
      itemsSold: rawItems.toLocaleString(),
      itemsTrend: '+16.1%',
      itemsTrendDir: 'up',
      avgPerBill: `฿${avg.toLocaleString()}`,
      avgTrend: '-1.8%',
      avgTrendDir: 'down',
    };
  });

  // Hourly / Periodic Chart series
  const hourlyCategories = computed(() => {
    if (timeFilter.value === 'month') {
      return ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'];
    }
    if (timeFilter.value === 'year') {
      return ['Q1', 'Q2', 'Q3', 'Q4'];
    }
    return ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  });

  const hourlyData = computed(() => {
    const bm = branchMultiplier.value;
    const tm = timeMultiplier.value;
    if (timeFilter.value === 'month') {
      return [115000, 142000, 138000, 169000].map((v) => Math.round(v * bm));
    }
    if (timeFilter.value === 'year') {
      return [1250000, 1480000, 1620000, 1890000].map((v) => Math.round(v * bm));
    }
    return [1500, 3200, 6800, 4200, 3900, 2700, 1800].map((v) => Math.round(v * bm * (tm > 1 ? tm / 10 : 1)));
  });

  // Donut Category Breakdown
  const categorySeries = computed(() => {
    const id = branchStore.selectedBranchId;
    if (id === 2) {
      // Bangsaen (more bakery and cold drinks)
      return [50, 35, 15];
    }
    if (id === 3) {
      // Chanthaburi
      return [55, 30, 15];
    }
    // Siam / All
    return [62, 23, 15];
  });

  // Top Selling Items
  const topSelling = computed<TopSellingItem[]>(() => {
    const bm = branchMultiplier.value;
    const tm = timeMultiplier.value;
    const factor = Math.max(1, Math.round(bm * tm));

    return [
      {
        rank: 1,
        name: 'Dirty Coffee (Special Blend)',
        code: 'CF-001',
        category: 'Coffee',
        quantitySold: 98 * factor,
        totalSales: 98 * 120 * factor,
        trend: '+24%',
        trendDir: 'up',
        icon: 'local_cafe',
      },
      {
        rank: 2,
        name: 'Kyoto Uji Matcha Latte',
        code: 'MT-002',
        category: 'Beverage',
        quantitySold: 84 * factor,
        totalSales: 84 * 135 * factor,
        trend: '+18%',
        trendDir: 'up',
        icon: 'emoji_food_beverage',
      },
      {
        rank: 3,
        name: 'Almond Croissant AOP',
        code: 'BK-005',
        category: 'Bakery',
        quantitySold: 65 * factor,
        totalSales: 65 * 110 * factor,
        trend: '+12%',
        trendDir: 'up',
        icon: 'bakery_dining',
      },
      {
        rank: 4,
        name: 'Iced Americano House Blend',
        code: 'CF-004',
        category: 'Coffee',
        quantitySold: 59 * factor,
        totalSales: 59 * 95 * factor,
        trend: '+7%',
        trendDir: 'up',
        icon: 'local_cafe',
      },
      {
        rank: 5,
        name: 'Basque Burnt Cheesecake',
        code: 'BK-009',
        category: 'Bakery',
        quantitySold: 42 * factor,
        totalSales: 42 * 145 * factor,
        trend: '+15%',
        trendDir: 'up',
        icon: 'cake',
      },
    ];
  });

  return {
    timeFilter,
    customDateRange,
    summary,
    hourlyCategories,
    hourlyData,
    categorySeries,
    topSelling,
  };
});

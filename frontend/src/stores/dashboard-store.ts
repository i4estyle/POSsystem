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

  const timeFilter = ref<'today' | 'week' | 'month' | 'year' | 'custom'>('today');
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

  // Calculate duration between custom dates
  const customDateDetails = computed(() => {
    let fromDate: Date;
    let toDate: Date;

    if (typeof customDateRange.value === 'string') {
      fromDate = new Date(customDateRange.value);
      toDate = new Date(customDateRange.value);
    } else if (customDateRange.value && customDateRange.value.from && customDateRange.value.to) {
      fromDate = new Date(customDateRange.value.from);
      toDate = new Date(customDateRange.value.to);
    } else {
      fromDate = new Date();
      toDate = new Date();
    }

    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
    const diffYears = diffDays / 365;

    return {
      fromDate,
      toDate,
      diffDays,
      diffYears,
      isMultiYear: diffYears >= 1.5,
      isMultiMonth: diffDays >= 35 && diffYears < 1.5,
    };
  });

  const timeMultiplier = computed(() => {
    switch (timeFilter.value) {
      case 'week':
        return 7;
      case 'month':
        return 30;
      case 'year':
        return 365;
      case 'custom':
        return customDateDetails.value.diffDays;
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

  // Smart Dynamic Chart Categories & Data (Approach A)
  const chartTitle = computed(() => {
    switch (timeFilter.value) {
      case 'week':
        return 'สถิติยอดขายรายวัน (สัปดาห์นี้)';
      case 'month':
        return 'สถิติยอดขายรายสัปดาห์ (เดือนนี้)';
      case 'year':
        return 'สถิติยอดขายรายไตรมาส (ปีนี้)';
      case 'custom': {
        const details = customDateDetails.value;
        if (details.isMultiYear) {
          const fromYear = details.fromDate.getFullYear();
          const toYear = details.toDate.getFullYear();
          return `สถิติยอดขายภาพรวม (${fromYear} - ${toYear})`;
        }
        if (details.isMultiMonth) {
          return `สถิติยอดขายรายเดือน (${details.diffDays} วัน)`;
        }
        return `สถิติยอดขายรายวัน (${details.diffDays} วัน)`;
      }
      case 'today':
      default:
        return 'สถิติยอดขายรายชั่วโมง (วันนี้)';
    }
  });

  const chartSubtitle = computed(() => {
    switch (timeFilter.value) {
      case 'week':
        return 'เปรียบเทียบยอดขาย 7 วันล่าสุด กับสัปดาห์ก่อนหน้า';
      case 'month':
        return 'เปรียบเทียบ 4 สัปดาห์ในเดือนนี้ กับเดือนที่แล้ว';
      case 'year':
        return 'เปรียบเทียบ 4 ไตรมาสในปีนี้ กับปีก่อนหน้า';
      case 'custom':
        return 'เปรียบเทียบช่วงเวลาที่เลือก กับช่วงเวลาก่อนหน้า';
      case 'today':
      default:
        return 'เปรียบเทียบยอดขายรายชั่วโมงวันนี้ กับเมื่อวานนี้';
    }
  });

  const chartCategories = computed(() => {
    switch (timeFilter.value) {
      case 'week':
        return ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสฯ', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
      case 'month':
        return ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'];
      case 'year':
        return ['Q1 (ม.ค.-มี.ค.)', 'Q2 (เม.ย.-มิ.ย.)', 'Q3 (ก.ค.-ก.ย.)', 'Q4 (ต.ค.-ธ.ค.)'];
      case 'custom': {
        const details = customDateDetails.value;
        if (details.isMultiYear) {
          const years: string[] = [];
          const startYear = details.fromDate.getFullYear();
          const endYear = details.toDate.getFullYear();
          for (let y = startYear; y <= endYear; y++) {
            years.push(String(y));
          }
          return years;
        }
        if (details.isMultiMonth) {
          return ['เดือน 1', 'เดือน 2', 'เดือน 3', 'เดือน 4', 'เดือน 5', 'เดือน 6'];
        }
        return ['วันที่ 1', 'วันที่ 2', 'วันที่ 3', 'วันที่ 4', 'วันที่ 5', 'วันที่ 6', 'วันที่ 7'];
      }
      case 'today':
      default:
        return ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
    }
  });

  // Current period sales data
  const currentSalesData = computed(() => {
    const bm = branchMultiplier.value;
    switch (timeFilter.value) {
      case 'week':
        return [14200, 16800, 15400, 18900, 26500, 34200, 31800].map((v) => Math.round(v * bm));
      case 'month':
        return [115000, 142000, 138000, 169000].map((v) => Math.round(v * bm));
      case 'year':
        return [1250000, 1480000, 1620000, 1890000].map((v) => Math.round(v * bm));
      case 'custom': {
        const details = customDateDetails.value;
        if (details.isMultiYear) {
          const count = chartCategories.value.length;
          // Generate annual sales in millions
          const yearlyBase = [4800000, 5600000, 6400000, 7200000];
          return Array.from({ length: count }, (_, i) => Math.round((yearlyBase[i % yearlyBase.length] ?? 5000000) * bm));
        }
        if (details.isMultiMonth) {
          return [420000, 485000, 510000, 490000, 560000, 620000].map((v) => Math.round(v * bm));
        }
        return [16500, 18200, 17900, 21400, 29800, 32100, 28700].map((v) => Math.round(v * bm));
      }
      case 'today':
      default:
        return [1500, 3200, 6800, 4200, 3900, 2700, 1800].map((v) => Math.round(v * bm));
    }
  });

  // Previous period comparison sales data (2nd line in chart)
  const previousSalesData = computed(() => {
    const bm = branchMultiplier.value;
    switch (timeFilter.value) {
      case 'week':
        return [12500, 14900, 14800, 17200, 23800, 30500, 28900].map((v) => Math.round(v * bm));
      case 'month':
        return [102000, 128000, 125000, 151000].map((v) => Math.round(v * bm));
      case 'year':
        return [1080000, 1320000, 1450000, 1680000].map((v) => Math.round(v * bm));
      case 'custom': {
        const details = customDateDetails.value;
        if (details.isMultiYear) {
          const count = chartCategories.value.length;
          const prevYearlyBase = [4200000, 4900000, 5800000, 6500000];
          return Array.from({ length: count }, (_, i) => Math.round((prevYearlyBase[i % prevYearlyBase.length] ?? 4500000) * bm));
        }
        if (details.isMultiMonth) {
          return [380000, 430000, 460000, 440000, 510000, 570000].map((v) => Math.round(v * bm));
        }
        return [15000, 16800, 16200, 19500, 27100, 29800, 26500].map((v) => Math.round(v * bm));
      }
      case 'today':
      default:
        return [1200, 2800, 5900, 3600, 3200, 2300, 1400].map((v) => Math.round(v * bm));
    }
  });

  const previousPeriodLabel = computed(() => {
    switch (timeFilter.value) {
      case 'week':
        return 'สัปดาห์ก่อนหน้า';
      case 'month':
        return 'เดือนก่อนหน้า';
      case 'year':
        return 'ปีก่อนหน้า';
      case 'custom':
        return 'ช่วงก่อนหน้า';
      case 'today':
      default:
        return 'เมื่อวานนี้';
    }
  });

  const currentPeriodLabel = computed(() => {
    switch (timeFilter.value) {
      case 'week':
        return 'สัปดาห์นี้';
      case 'month':
        return 'เดือนนี้';
      case 'year':
        return 'ปีนี้';
      case 'custom':
        return 'ช่วงที่เลือก';
      case 'today':
      default:
        return 'วันนี้';
    }
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
    chartTitle,
    chartSubtitle,
    chartCategories,
    currentSalesData,
    previousSalesData,
    currentPeriodLabel,
    previousPeriodLabel,
    categorySeries,
    topSelling,
  };
});

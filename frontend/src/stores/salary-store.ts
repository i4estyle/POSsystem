import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface SalaryRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  role: string;
  month: string; // YYYY-MM
  baseSalary: number;
  overtimePay: number;
  bonus: number;
  deduction: number;
  totalNet: number;
  paymentStatus: 'paid' | 'pending';
  paymentDate?: string;
  paymentMethod?: string;
}

const INITIAL_SALARY_RECORDS: SalaryRecord[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'สมชาย ใจดี',
    role: 'ผู้จัดการสาขา',
    month: '2026-07',
    baseSalary: 45000,
    overtimePay: 2500,
    bonus: 5000,
    deduction: 750,
    totalNet: 51750,
    paymentStatus: 'paid',
    paymentDate: '2026-07-28',
    paymentMethod: 'Bank Transfer (KBank)',
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: 'นภา แจ่มใส',
    role: 'พนักงานแคชเชียร์',
    month: '2026-07',
    baseSalary: 22000,
    overtimePay: 1800,
    bonus: 2000,
    deduction: 450,
    totalNet: 25350,
    paymentStatus: 'paid',
    paymentDate: '2026-07-28',
    paymentMethod: 'Bank Transfer (SCB)',
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: 'กิตติ วัฒนกุล',
    role: 'หัวหน้าห้องครัว',
    month: '2026-07',
    baseSalary: 38000,
    overtimePay: 3200,
    bonus: 3500,
    deduction: 600,
    totalNet: 44100,
    paymentStatus: 'pending',
  },
  {
    id: 4,
    employeeId: 4,
    employeeName: 'วิภา รุ่งเรือง',
    role: 'พนักงานบริการ',
    month: '2026-07',
    baseSalary: 18500,
    overtimePay: 1200,
    bonus: 1000,
    deduction: 350,
    totalNet: 20350,
    paymentStatus: 'pending',
  },
];

export const useSalaryStore = defineStore('salary', () => {
  const records = ref<SalaryRecord[]>(INITIAL_SALARY_RECORDS);
  const searchQuery = ref('');
  const statusFilter = ref('all');
  const monthFilter = ref('2026-07');

  const filteredRecords = computed(() => {
    let result = records.value;

    if (statusFilter.value !== 'all') {
      result = result.filter((r) => r.paymentStatus === statusFilter.value);
    }

    if (monthFilter.value) {
      result = result.filter((r) => r.month === monthFilter.value);
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      result = result.filter(
        (r) => r.employeeName.toLowerCase().includes(q) || r.role.toLowerCase().includes(q),
      );
    }

    return result;
  });

  const totalPayrollAmount = computed(() =>
    filteredRecords.value.reduce((acc, r) => acc + r.totalNet, 0),
  );

  const calculateNet = (base: number, ot: number, bonus: number, ded: number): number => {
    return Math.max(0, base + ot + bonus - ded);
  };

  const addSalaryRecord = (data: Omit<SalaryRecord, 'id' | 'totalNet'>): void => {
    const newId = Math.max(0, ...records.value.map((r) => r.id)) + 1;
    const totalNet = calculateNet(data.baseSalary, data.overtimePay, data.bonus, data.deduction);

    records.value.unshift({
      ...data,
      id: newId,
      totalNet,
    });
  };

  const updateSalaryRecord = (id: number, payload: Partial<SalaryRecord>): void => {
    const item = records.value.find((r) => r.id === id);
    if (item) {
      Object.assign(item, payload);
      item.totalNet = calculateNet(item.baseSalary, item.overtimePay, item.bonus, item.deduction);
    }
  };

  const markAsPaid = (id: number, paymentMethod = 'Bank Transfer'): void => {
    const item = records.value.find((r) => r.id === id);
    if (item) {
      item.paymentStatus = 'paid';
      item.paymentDate = new Date().toISOString().slice(0, 10);
      item.paymentMethod = paymentMethod;
    }
  };

  const deleteSalaryRecord = (id: number): void => {
    records.value = records.value.filter((r) => r.id !== id);
  };

  return {
    records,
    searchQuery,
    statusFilter,
    monthFilter,
    filteredRecords,
    totalPayrollAmount,
    addSalaryRecord,
    updateSalaryRecord,
    markAsPaid,
    deleteSalaryRecord,
  };
});

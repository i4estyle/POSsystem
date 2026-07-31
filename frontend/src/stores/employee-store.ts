import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface EmployeeItem {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  role: string;
  branch: string;
  phone: string;
  email: string;
  salary: number;
  startDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

const INITIAL_EMPLOYEES: EmployeeItem[] = [
  {
    id: 1,
    code: 'EMP-001',
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    role: 'ผู้จัดการสาขา (Branch Manager)',
    branch: 'สาขาหลัก (Main Branch)',
    phone: '081-234-5678',
    email: 'somchai@i4estyle.com',
    salary: 45000,
    startDate: '2024-01-15',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
  },
  {
    id: 2,
    code: 'EMP-002',
    firstName: 'นภา',
    lastName: 'แจ่มใส',
    role: 'พนักงานแคชเชียร์ (Head Cashier)',
    branch: 'สาขาหลัก (Main Branch)',
    phone: '089-876-5432',
    email: 'napha@i4estyle.com',
    salary: 22000,
    startDate: '2024-03-01',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
  },
  {
    id: 3,
    code: 'EMP-003',
    firstName: 'กิตติ',
    lastName: 'วัฒนกุล',
    role: 'หัวหน้าห้องครัว (Executive Chef)',
    branch: 'สาขาหลัก (Main Branch)',
    phone: '086-111-2233',
    email: 'kitti@i4estyle.com',
    salary: 38000,
    startDate: '2024-02-10',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    id: 4,
    code: 'EMP-004',
    firstName: 'วิภา',
    lastName: 'รุ่งเรือง',
    role: 'พนักงานบริการ (Barista / Service)',
    branch: 'สาขา 2 (Central Mall)',
    phone: '082-999-8877',
    email: 'wipha@i4estyle.com',
    salary: 18500,
    startDate: '2024-05-20',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  },
  {
    id: 5,
    code: 'EMP-005',
    firstName: 'ประเสริฐ',
    lastName: 'มั่นคง',
    role: 'พนักงานคลังสินค้า (Stock Supervisor)',
    branch: 'สาขาหลัก (Main Branch)',
    phone: '084-555-4433',
    email: 'prasert@i4estyle.com',
    salary: 24000,
    startDate: '2024-04-12',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  },
];

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<EmployeeItem[]>(INITIAL_EMPLOYEES);
  const searchQuery = ref('');
  const roleFilter = ref('all');

  const filteredEmployees = computed(() => {
    let result = employees.value;

    if (roleFilter.value !== 'all') {
      result = result.filter((emp) => emp.role === roleFilter.value);
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      result = result.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(q) ||
          emp.lastName.toLowerCase().includes(q) ||
          emp.code.toLowerCase().includes(q) ||
          emp.phone.includes(q),
      );
    }

    return result;
  });

  const addEmployee = (data: Omit<EmployeeItem, 'id' | 'code'>): void => {
    const newId = Math.max(0, ...employees.value.map((e) => e.id)) + 1;
    const code = `EMP-${String(newId).padStart(3, '0')}`;
    employees.value.unshift({
      ...data,
      id: newId,
      code,
    });
  };

  const updateEmployee = (id: number, payload: Partial<EmployeeItem>): void => {
    const item = employees.value.find((e) => e.id === id);
    if (item) {
      Object.assign(item, payload);
    }
  };

  const deleteEmployee = (id: number): void => {
    employees.value = employees.value.filter((e) => e.id !== id);
  };

  const toggleStatus = (id: number): void => {
    const item = employees.value.find((e) => e.id === id);
    if (item) {
      item.status = item.status === 'active' ? 'inactive' : 'active';
    }
  };

  return {
    employees,
    searchQuery,
    roleFilter,
    filteredEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    toggleStatus,
  };
});

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface MemberItem {
  id: number;
  memberCode: string;
  name: string;
  phone: string;
  email: string;
  points: number;
  tier: 'Silver' | 'Gold' | 'VIP';
  registeredDate: string;
  totalSpent: number;
  status: 'active' | 'inactive';
}

const INITIAL_MEMBERS: MemberItem[] = [
  {
    id: 1,
    memberCode: 'MB-1001',
    name: 'คุณธีรเดช สุขสันต์',
    phone: '081-888-9999',
    email: 'theerapat@gmail.com',
    points: 1250,
    tier: 'VIP',
    registeredDate: '2025-11-10',
    totalSpent: 25400,
    status: 'active',
  },
  {
    id: 2,
    memberCode: 'MB-1002',
    name: 'คุณชนิกา เจริญผล',
    phone: '089-777-6655',
    email: 'chanika.c@yahoo.com',
    points: 680,
    tier: 'Gold',
    registeredDate: '2026-01-15',
    totalSpent: 13600,
    status: 'active',
  },
  {
    id: 3,
    memberCode: 'MB-1003',
    name: 'คุณอนันต์ สายชล',
    phone: '086-333-2211',
    email: 'anant.s@outlook.com',
    points: 320,
    tier: 'Silver',
    registeredDate: '2026-04-05',
    totalSpent: 6400,
    status: 'active',
  },
  {
    id: 4,
    memberCode: 'MB-1004',
    name: 'คุณกมลชนก ฤทธิ์เดช',
    phone: '084-222-1100',
    email: 'kamon.r@gmail.com',
    points: 95,
    tier: 'Silver',
    registeredDate: '2026-06-20',
    totalSpent: 1900,
    status: 'active',
  },
];

export const useMemberStore = defineStore('member', () => {
  const members = ref<MemberItem[]>(INITIAL_MEMBERS);
  const searchQuery = ref('');
  const tierFilter = ref('all');

  const filteredMembers = computed(() => {
    let result = members.value;

    if (tierFilter.value !== 'all') {
      result = result.filter((m) => m.tier === tierFilter.value);
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.memberCode.toLowerCase().includes(q) ||
          m.phone.includes(q),
      );
    }

    return result;
  });

  const calculateTier = (points: number): 'Silver' | 'Gold' | 'VIP' => {
    if (points >= 1000) return 'VIP';
    if (points >= 500) return 'Gold';
    return 'Silver';
  };

  const addMember = (
    data: Omit<
      MemberItem,
      'id' | 'memberCode' | 'points' | 'tier' | 'registeredDate' | 'totalSpent' | 'status'
    >,
  ): void => {
    const newId = Math.max(0, ...members.value.map((m) => m.id)) + 1;
    const memberCode = `MB-${1000 + newId}`;
    const registeredDate = new Date().toISOString().slice(0, 10);

    members.value.unshift({
      ...data,
      id: newId,
      memberCode,
      points: 50, // Welcome bonus 50 pts
      tier: 'Silver',
      registeredDate,
      totalSpent: 0,
      status: 'active',
    });
  };

  const updateMember = (id: number, payload: Partial<MemberItem>): void => {
    const item = members.value.find((m) => m.id === id);
    if (item) {
      Object.assign(item, payload);
      item.tier = calculateTier(item.points);
    }
  };

  const adjustPoints = (id: number, pointsDelta: number): void => {
    const item = members.value.find((m) => m.id === id);
    if (item) {
      item.points = Math.max(0, item.points + pointsDelta);
      item.tier = calculateTier(item.points);
    }
  };

  const deleteMember = (id: number): void => {
    members.value = members.value.filter((m) => m.id !== id);
  };

  return {
    members,
    searchQuery,
    tierFilter,
    filteredMembers,
    addMember,
    updateMember,
    adjustPoints,
    deleteMember,
  };
});

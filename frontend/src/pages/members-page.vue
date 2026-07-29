<template>
  <q-page class="members-page">
    <section class="pos-sales-layout members-layout">
      <PosSidebarNav @new-order="notifyNewOrder" />
      <main class="pos-main-wrapper members-main">
        <PosHeaderBar />

        <section class="members-content">
          <header class="members-header">
            <div>
              <h1>{{ t('members.title') }}</h1>
              <small>{{ t('members.subtitle', { branch: currentBranchName }) }}</small>
            </div>
            <button type="button" class="add-member-btn" @click="onAddMember">
              <q-icon name="person_add" size="20px" />
              <span>{{ t('members.addMember') }}</span>
            </button>
          </header>

          <MemberSummaryCards />

          <div class="members-toolbar">
            <div class="filter-pills">
              <button
                v-for="filter in filters"
                :key="filter.id"
                type="button"
                :class="{ active: activeFilter === filter.id }"
                @click="activeFilter = filter.id"
              >
                {{ t(filter.labelKey) }}
              </button>
            </div>
          </div>

          <MemberDataTable
            :items="filteredMembers"
            @edit="onEditMember"
            @add-points="onAddPoints"
          />
        </section>
      </main>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { useSearchState } from '@/composables/use-search-state';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import MemberSummaryCards from '@/components/members/member-summary-cards.vue';
import MemberDataTable, { type MemberItem } from '@/components/members/member-data-table.vue';

const $q = useQuasar();
const { t } = useI18n();
const authStore = useAuthStore();
const { searchQuery } = useSearchState();

const activeFilter = ref('all');

const currentBranchName = computed(
  () =>
    authStore.currentUser?.branchName ||
    authStore.currentUser?.branch?.branchName ||
    'Downtown Branch',
);

const filters = [
  { id: 'all', labelKey: 'members.filters.all' },
  { id: 'platinum', labelKey: 'members.filters.platinum' },
  { id: 'gold', labelKey: 'members.filters.gold' },
  { id: 'silver', labelKey: 'members.filters.silver' },
  { id: 'bronze', labelKey: 'members.filters.bronze' },
];

const membersList = ref<MemberItem[]>([
  {
    memberId: 'MEM-00101',
    name: 'คุณชนิกานต์ วงศ์สวัสดิ์',
    phone: '081-987-6543',
    tierKey: 'members.tiers.platinum',
    tierClass: 'platinum',
    points: 4850,
    totalSpend: '฿48,500',
    statusClass: 'active',
    statusKey: 'members.status.active',
  },
  {
    memberId: 'MEM-00102',
    name: 'คุณกิตติศักดิ์ มีสุข',
    phone: '089-123-4567',
    tierKey: 'members.tiers.gold',
    tierClass: 'gold',
    points: 2340,
    totalSpend: '฿23,400',
    statusClass: 'active',
    statusKey: 'members.status.active',
  },
  {
    memberId: 'MEM-00103',
    name: 'คุณธนพล สมบูรณ์',
    phone: '086-555-7890',
    tierKey: 'members.tiers.gold',
    tierClass: 'gold',
    points: 1820,
    totalSpend: '฿18,200',
    statusClass: 'active',
    statusKey: 'members.status.active',
  },
  {
    memberId: 'MEM-00104',
    name: 'คุณปรียาภรณ์ กิจเจริญ',
    phone: '084-222-3344',
    tierKey: 'members.tiers.silver',
    tierClass: 'silver',
    points: 950,
    totalSpend: '฿9,500',
    statusClass: 'active',
    statusKey: 'members.status.active',
  },
  {
    memberId: 'MEM-00105',
    name: 'คุณวิศรุต สุวรรณเวช',
    phone: '087-111-9988',
    tierKey: 'members.tiers.bronze',
    tierClass: 'bronze',
    points: 320,
    totalSpend: '฿3,200',
    statusClass: 'inactive',
    statusKey: 'members.status.inactive',
  },
]);

const filteredMembers = computed(() =>
  membersList.value.filter((item) => {
    const matchFilter = activeFilter.value === 'all' || item.tierClass === activeFilter.value;
    const q = searchQuery.value.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.memberId.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  }),
);

const notifyNewOrder = (): void => {
  $q.notify({ message: t('orders.newOrderPending'), color: 'primary', position: 'top' });
};

const onAddMember = (): void => {
  $q.notify({
    message: t('members.addMemberPending'),
    color: 'primary',
    position: 'top',
  });
};

const onEditMember = (item: MemberItem): void => {
  $q.notify({
    message: t('members.editMember', { name: item.name }),
    color: 'primary',
    position: 'top',
  });
};

const onAddPoints = (item: MemberItem): void => {
  item.points += 100;
  $q.notify({
    message: t('members.addPoints', { name: item.name }),
    color: 'positive',
    position: 'top',
  });
};
</script>

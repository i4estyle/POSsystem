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
            <button type="button" class="add-member-btn" @click="openAddDialog">
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
                :class="{ active: memberStore.tierFilter === filter.id }"
                @click="memberStore.tierFilter = filter.id"
              >
                {{ t(filter.labelKey) }}
              </button>
            </div>
          </div>

          <MemberDataTable
            :items="tableRows"
            @edit="openEditDialog"
            @add-points="openPointDialog"
          />
        </section>
      </main>
    </section>

    <!-- Member Form Dialog -->
    <MemberFormDialog v-model="showFormModal" :member="editingMember" @save="onSaveMember" />

    <!-- Member Point Dialog -->
    <MemberPointDialog
      v-model="showPointModal"
      :member="pointingMember"
      @confirm="onAdjustPoints"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { useMemberStore, type MemberItem } from '@/stores/member-store';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import MemberSummaryCards from '@/components/members/member-summary-cards.vue';
import MemberDataTable, {
  type MemberItem as TableMemberItem,
} from '@/components/members/member-data-table.vue';
import MemberFormDialog from '@/components/members/member-form-dialog.vue';
import MemberPointDialog from '@/components/members/member-point-dialog.vue';

const $q = useQuasar();
const { t } = useI18n();
const authStore = useAuthStore();
const memberStore = useMemberStore();

const showFormModal = ref(false);
const showPointModal = ref(false);
const editingMember = ref<MemberItem | null>(null);
const pointingMember = ref<MemberItem | null>(null);

const currentBranchName = computed(
  () =>
    authStore.currentUser?.branchName ||
    authStore.currentUser?.branch?.branchName ||
    'สาขาหลัก (Main Branch)',
);

const filters = [
  { id: 'all', labelKey: 'members.filters.all' },
  { id: 'VIP', labelKey: 'members.tiers.platinum' },
  { id: 'Gold', labelKey: 'members.filters.gold' },
  { id: 'Silver', labelKey: 'members.filters.silver' },
];

const tableRows = computed<TableMemberItem[]>(() =>
  memberStore.filteredMembers.map((m) => ({
    id: m.id,
    memberId: m.memberCode,
    name: m.name,
    phone: m.phone,
    tierKey: `members.tiers.${m.tier.toLowerCase()}`,
    tierClass: m.tier === 'VIP' ? 'platinum' : (m.tier.toLowerCase() as 'gold' | 'silver'),
    points: m.points,
    totalSpend: `฿${m.totalSpent.toLocaleString()}`,
    statusClass: m.status === 'active' ? 'active' : 'inactive',
    statusKey: m.status === 'active' ? 'members.status.active' : 'members.status.inactive',
    rawMember: m,
  })),
);

const openAddDialog = (): void => {
  editingMember.value = null;
  showFormModal.value = true;
};

const openEditDialog = (item: { rawMember?: MemberItem; memberId: string }): void => {
  editingMember.value =
    item.rawMember || memberStore.members.find((m) => m.memberCode === item.memberId) || null;
  showFormModal.value = true;
};

const openPointDialog = (item: { rawMember?: MemberItem; memberId: string }): void => {
  pointingMember.value =
    item.rawMember || memberStore.members.find((m) => m.memberCode === item.memberId) || null;
  showPointModal.value = true;
};

const onSaveMember = (
  payload:
    | Omit<
        MemberItem,
        'id' | 'memberCode' | 'points' | 'tier' | 'registeredDate' | 'totalSpent' | 'status'
      >
    | Partial<MemberItem>,
): void => {
  if (editingMember.value) {
    memberStore.updateMember(editingMember.value.id, payload);
    $q.notify({
      type: 'positive',
      message: t('settings.saveSuccess'),
      position: 'top',
    });
  } else {
    memberStore.addMember(
      payload as Omit<
        MemberItem,
        'id' | 'memberCode' | 'points' | 'tier' | 'registeredDate' | 'totalSpent' | 'status'
      >,
    );
    $q.notify({
      type: 'positive',
      message: 'ลงทะเบียนสมาชิกสำเร็จ (+50 คะแนนต้อนรับ)',
      position: 'top',
    });
  }
};

const onAdjustPoints = (delta: number): void => {
  if (pointingMember.value) {
    memberStore.adjustPoints(pointingMember.value.id, delta);
    $q.notify({
      type: 'positive',
      message: `ปรับปรุงคะแนนเรียบร้อย (${delta > 0 ? '+' : ''}${delta} แต้ม)`,
      position: 'top',
    });
  }
};

const notifyNewOrder = (): void => {
  $q.notify({ message: t('orders.newOrderPending'), color: 'primary', position: 'top' });
};
</script>

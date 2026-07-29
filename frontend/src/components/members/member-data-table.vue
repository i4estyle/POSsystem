<template>
  <AppDataTable :rows="items" :columns="columns" row-key="memberId">
    <template #body-cell-memberId="props">
      <div class="member-id-cell">
        <span class="id-tag">{{ props.row.memberId }}</span>
      </div>
    </template>

    <template #body-cell-name="props">
      <div class="member-info-cell">
        <div class="member-avatar" :class="props.row.tierClass">
          <span>{{ props.row.name.charAt(0) }}</span>
        </div>
        <div class="name-phone">
          <strong class="member-name">{{ props.row.name }}</strong>
          <span class="member-phone">{{ props.row.phone }}</span>
        </div>
      </div>
    </template>

    <template #body-cell-tier="props">
      <div class="center-wrapper">
        <span class="tier-chip" :class="props.row.tierClass">
          <q-icon name="workspace_premium" size="14px" />
          {{ t(props.row.tierKey) }}
        </span>
      </div>
    </template>

    <template #body-cell-points="props">
      <div class="center-wrapper">
        <div class="points-box">
          <q-icon name="stars" size="16px" class="star-icon" />
          <span class="points-num">{{ props.row.points.toLocaleString() }}</span>
        </div>
      </div>
    </template>

    <template #body-cell-totalSpend="props">
      <div class="center-wrapper">
        <span class="spend-text">{{ props.row.totalSpend }}</span>
      </div>
    </template>

    <template #body-cell-status="props">
      <div class="center-wrapper">
        <div class="status-glow-pill" :class="props.row.statusClass">
          <span class="glow-dot"></span>
          <span>{{ t(props.row.statusKey) }}</span>
        </div>
      </div>
    </template>

    <template #body-cell-actions="props">
      <div class="center-wrapper">
        <div class="action-buttons-group">
          <button
            type="button"
            class="icon-btn add-pts-btn"
            :title="t('members.addPoints', { name: props.row.name })"
            @click="$emit('add-points', props.row)"
          >
            <q-icon name="add_circle_outline" size="20px" />
          </button>
          <button
            type="button"
            class="icon-btn edit-btn"
            :title="t('members.editMember', { name: props.row.name })"
            @click="$emit('edit', props.row)"
          >
            <q-icon name="edit_note" size="20px" />
          </button>
        </div>
      </div>
    </template>
  </AppDataTable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { QTableColumn } from 'quasar';
import AppDataTable from '@/components/base/app-data-table.vue';

export interface MemberItem extends Record<string, unknown> {
  memberId: string;
  name: string;
  phone: string;
  tierKey: string;
  tierClass: 'platinum' | 'gold' | 'silver' | 'bronze';
  points: number;
  totalSpend: string;
  statusClass: 'active' | 'inactive';
  statusKey: string;
}

defineProps<{
  items: MemberItem[];
}>();

defineEmits<{
  (e: 'edit', item: MemberItem): void;
  (e: 'add-points', item: MemberItem): void;
}>();

const { t } = useI18n();

const sortString = (a: unknown, b: unknown): number => {
  const strA = typeof a === 'string' || typeof a === 'number' ? String(a) : '';
  const strB = typeof b === 'string' || typeof b === 'number' ? String(b) : '';
  return strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
};

const parseNum = (val: unknown): number => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[^0-9.-]+/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const tierRank: Record<string, number> = {
  platinum: 4,
  gold: 3,
  silver: 2,
  bronze: 1,
};

const columns = computed<QTableColumn<MemberItem>[]>(() => [
  {
    name: 'memberId',
    required: true,
    label: t('members.table.memberId'),
    align: 'left',
    field: 'memberId',
    sortable: true,
    sort: (a, b) => sortString(a, b),
  },
  {
    name: 'name',
    required: true,
    label: t('members.table.name'),
    align: 'left',
    field: 'name',
    sortable: true,
    sort: (a, b) => sortString(a, b),
  },
  {
    name: 'tier',
    required: true,
    label: t('members.table.tier'),
    align: 'center',
    field: 'tierClass',
    sortable: true,
    sort: (a, b) => (tierRank[String(a)] || 0) - (tierRank[String(b)] || 0),
  },
  {
    name: 'points',
    required: true,
    label: t('members.table.points'),
    align: 'center',
    field: 'points',
    sortable: true,
    sort: (a, b) => Number(a) - Number(b),
  },
  {
    name: 'totalSpend',
    required: true,
    label: t('members.table.totalSpend'),
    align: 'center',
    field: 'totalSpend',
    sortable: true,
    sort: (a, b) => parseNum(a) - parseNum(b),
  },
  {
    name: 'status',
    required: true,
    label: t('members.table.status'),
    align: 'center',
    field: 'statusClass',
    sortable: true,
    sort: (a, b) => sortString(a, b),
  },
  {
    name: 'actions',
    required: true,
    label: t('members.table.actions'),
    align: 'center',
    field: (row) => row.memberId,
  },
]);
</script>

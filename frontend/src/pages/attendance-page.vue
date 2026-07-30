<template>
  <q-page class="attendance-page">
    <section class="pos-sales-layout attendance-layout">
      <PosSidebarNav />
      <main class="pos-main-wrapper attendance-main">
        <PosHeaderBar />
        <section class="attendance-content">
          <header class="attendance-page__header">
            <div>
              <h1>{{ t('attendance.title') }}</h1>
              <small>{{ t('attendance.subtitle') }}</small>
            </div>
          </header>
          <div class="attendance-grid">
            <AttendanceCurrentCard
              :today-label="todayLabel"
              :current-time="currentTime"
              :check-in-label="t('attendance.checkIn')"
              :check-out-label="t('attendance.checkOut')"
              :check-in-hint="t('attendance.checkInHint')"
              :check-out-hint="t('attendance.checkOutHint')"
              :live-sync-label="t('attendance.liveSync')"
              @check-in="checkIn"
              @check-out="checkOut"
            />
            <AttendanceHistoryList
              :title="t('attendance.historyTitle')"
              :subtitle="t('attendance.historySubtitle')"
              :view-all-label="t('attendance.viewAll')"
              :records="historyRecords"
              @view-all="isHistoryDialogOpen = true"
            />
            <AttendanceLocationCard
              :title="t('attendance.currentLocation')"
              :address="t('attendance.address')"
            />
          </div>
          <AttendanceHistoryDialog
            v-model="isHistoryDialogOpen"
            :title="t('attendance.allHistoryTitle')"
            :subtitle="t('attendance.historySubtitle')"
            :close-label="t('attendance.close')"
            :records="attendanceStore.records"
            :format-date="formatDate"
            :format-time="formatRecordTime"
            :status-label="statusLabel"
          />
        </section>
      </main>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import AttendanceCurrentCard from '@/components/attendance/attendance-current-card.vue';
import AttendanceHistoryList, {
  type AttendanceHistoryRecord,
} from '@/components/attendance/attendance-history-list.vue';
import AttendanceLocationCard from '@/components/attendance/attendance-location-card.vue';
import AttendanceHistoryDialog from '@/components/attendance/attendance-history-dialog.vue';
import {
  useAttendanceStore,
  type AttendanceRecord,
  type AttendanceStatus,
} from '@/stores/attendance-store';

const { t, locale } = useI18n();
const $q = useQuasar();
const attendanceStore = useAttendanceStore();
const now = ref(new Date());
const isHistoryDialogOpen = ref(false);
let timer: ReturnType<typeof setInterval>;

const localeCode = computed(() => (locale.value === 'th' ? 'th-TH' : 'en-US'));
const currentTime = computed(() =>
  new Intl.DateTimeFormat(localeCode.value, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now.value),
);
const todayLabel = computed(() =>
  new Intl.DateTimeFormat(localeCode.value, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now.value),
);
const formatDate = (date: string): string =>
  new Intl.DateTimeFormat(localeCode.value, {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
const formatRecordTime = (record: AttendanceRecord): string =>
  record.status === 'day-off'
    ? t('attendance.weeklyDayOff')
    : !record.checkOut
      ? `${record.checkIn} — ${t('attendance.working')}`
      : `${record.checkIn} — ${record.checkOut}`;
const statusLabel = (status: AttendanceStatus): string => t(`attendance.statuses.${status}`);
const historyRecords = computed<AttendanceHistoryRecord[]>(() =>
  attendanceStore.records.slice(0, 3).map((record) => ({
    date: formatDate(record.date),
    time: formatRecordTime(record),
    status: record.status === 'in-progress' ? 'on-time' : record.status,
    statusLabel: statusLabel(record.status),
  })),
);

const checkIn = (): void => {
  if (attendanceStore.activeRecord) {
    $q.notify({ message: t('attendance.alreadyCheckedIn'), color: 'warning', position: 'top' });
    return;
  }
  attendanceStore.checkIn();
  $q.notify({ message: t('attendance.checkInSuccess'), color: 'positive', position: 'top' });
};
const checkOut = (): void => {
  if (!attendanceStore.activeRecord) {
    $q.notify({ message: t('attendance.notCheckedIn'), color: 'warning', position: 'top' });
    return;
  }
  attendanceStore.checkOut();
  $q.notify({ message: t('attendance.checkOutSuccess'), color: 'positive', position: 'top' });
};
onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

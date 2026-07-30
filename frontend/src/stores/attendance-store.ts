import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export type AttendanceStatus = 'on-time' | 'late' | 'day-off' | 'in-progress';

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
}

const mockRecords: AttendanceRecord[] = [
  { id: 'att-10', date: '2026-07-29', checkIn: '08:24', checkOut: '17:03', status: 'on-time' },
  { id: 'att-09', date: '2026-07-28', checkIn: '08:32', checkOut: '17:14', status: 'late' },
  { id: 'att-08', date: '2026-07-27', checkIn: '08:19', checkOut: '17:00', status: 'on-time' },
  { id: 'att-07', date: '2026-07-26', status: 'day-off' },
  { id: 'att-06', date: '2026-07-25', checkIn: '08:30', checkOut: '18:12', status: 'on-time' },
  { id: 'att-05', date: '2026-07-24', checkIn: '08:47', checkOut: '17:25', status: 'late' },
  { id: 'att-04', date: '2026-07-23', checkIn: '08:14', checkOut: '17:06', status: 'on-time' },
  { id: 'att-03', date: '2026-07-22', checkIn: '09:05', checkOut: '18:02', status: 'late' },
  { id: 'att-02', date: '2026-07-21', checkIn: '08:29', checkOut: '17:18', status: 'on-time' },
  { id: 'att-01', date: '2026-07-20', checkIn: '08:35', checkOut: '17:00', status: 'late' },
];

const toDateKey = (date: Date): string => date.toISOString().slice(0, 10);
const toTime = (date: Date): string => date.toTimeString().slice(0, 5);

export const useAttendanceStore = defineStore('attendance', () => {
  const records = ref<AttendanceRecord[]>([...mockRecords]);
  const activeRecord = computed(() =>
    records.value.find((record) => record.status === 'in-progress'),
  );

  const checkIn = (date = new Date()): AttendanceRecord => {
    const time = toTime(date);
    const record: AttendanceRecord = {
      id: `att-${Date.now()}`,
      date: toDateKey(date),
      checkIn: time,
      status: time > '08:30' ? 'late' : 'in-progress',
    };
    records.value.unshift(record);
    return record;
  };

  const checkOut = (date = new Date()): AttendanceRecord | undefined => {
    if (!activeRecord.value) return undefined;
    activeRecord.value.checkOut = toTime(date);
    if (activeRecord.value.status === 'in-progress') activeRecord.value.status = 'on-time';
    return activeRecord.value;
  };

  return { records, activeRecord, checkIn, checkOut };
});

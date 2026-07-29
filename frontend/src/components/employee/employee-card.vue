<template>
  <div class="staff-card">
    <div class="card-top">
      <div class="staff-avatar">{{ employee.name.charAt(0) }}</div>
      <div class="staff-meta">
        <h3>{{ employee.name }}</h3>
        <span class="role-tag">{{ employee.role }}</span>
      </div>
    </div>

    <div class="card-details">
      <div class="detail-row">
        <q-icon name="email" size="16px" />
        <span>{{ employee.email }}</span>
      </div>
      <div class="detail-row">
        <q-icon name="phone" size="16px" />
        <span>{{ employee.phone }}</span>
      </div>
      <div class="detail-row">
        <q-icon name="badge" size="16px" />
        <span>ID: {{ employee.employeeId }}</span>
      </div>
    </div>

    <div class="card-footer">
      <div
        class="status-pill"
        :class="{ active: employee.isOnDuty, 'off-duty': !employee.isOnDuty }"
      >
        <span class="status-dot"></span>
        <span>{{ employee.isOnDuty ? t('staff.status.onDuty') : t('staff.status.offDuty') }}</span>
      </div>
      <span class="schedule-info">{{ employee.shiftInfo }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

export interface EmployeeInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  employeeId: string;
  isOnDuty: boolean;
  shiftInfo: string;
}

defineProps<{
  employee: EmployeeInfo;
}>();
</script>

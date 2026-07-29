<template>
  <header class="pos-header">
    <div class="header-left-group">
      <button
        type="button"
        class="sidebar-toggle-btn"
        :title="isCollapsed ? 'ขยายเมนู' : 'พับเมนู'"
        aria-label="Toggle sidebar collapse"
        @click="toggleCollapse"
      >
        <q-icon name="menu_open" class="toggle-icon" :class="{ rotated: isCollapsed }" />
      </button>

      <PosSearchInput
        v-if="!isSearchHidden"
        :model-value="searchQuery !== undefined ? searchQuery : globalSearchQuery"
        :placeholder="placeholder || searchPlaceholder"
        @update:model-value="onSearchUpdate"
      />

      <div class="header-dashboard-widgets">
        <div class="status-live-badge">
          <span class="pulse-dot"></span>
          <span class="status-text">{{ t('pos.storeOnlineStatus') }}</span>
        </div>

        <div class="clock-live-badge">
          <div class="clock-icon-stage">
            <q-icon name="schedule" size="17px" class="clock-icon" />
          </div>
          <div class="clock-info-text">
            <span class="live-date-text">{{ liveFormattedDate }}</span>
            <span class="time-divider">•</span>
            <span class="live-time-text">
              <span class="time-num">{{ liveHours }}</span>
              <span class="time-colon">:</span>
              <span class="time-num">{{ liveMinutes }}</span>
              <span class="time-colon">:</span>
              <span class="time-num">{{ liveSeconds }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <section class="user-controls">
      <div class="quick-tools-group">
        <button
          type="button"
          class="header-tool-btn drawer-btn"
          :title="t('pos.openCashDrawer')"
          @click="onOpenCashDrawer"
        >
          <q-icon name="point_of_sale" size="20px" />
        </button>

        <button
          type="button"
          class="header-tool-btn notifications-btn"
          :title="t('pos.notifications.title')"
        >
          <q-icon name="notifications" size="20px" />
          <span v-if="notifications.length > 0" class="unread-badge">
            {{ notifications.length }}
          </span>

          <q-menu
            anchor="bottom right"
            self="top right"
            :offset="[0, 8]"
            class="notifications-menu"
          >
            <div class="notif-header">
              <div class="notif-title-box">
                <strong>{{ t('pos.notifications.title') }}</strong>
                <span v-if="notifications.length > 0" class="notif-count-pill">
                  {{ t('pos.notifications.countText', { count: notifications.length }) }}
                </span>
              </div>
              <button
                v-if="notifications.length > 0"
                type="button"
                class="clear-all-btn"
                @click="onClearAllNotifications"
              >
                <span>{{ t('pos.notifications.clearAll') }}</span>
              </button>
            </div>

            <div v-if="notifications.length > 0" class="notif-scroll-container">
              <q-list class="notif-list">
                <q-item
                  v-for="notif in notifications"
                  :key="notif.id"
                  clickable
                  class="notif-item"
                  @click="onSelectNotification(notif)"
                >
                  <q-item-section avatar class="notif-avatar-col">
                    <div class="notif-icon-box" :class="notif.color">
                      <q-icon :name="notif.icon" size="18px" />
                    </div>
                  </q-item-section>
                  <q-item-section class="notif-content-col">
                    <q-item-label class="notif-item-title">{{ notif.title }}</q-item-label>
                    <q-item-label caption class="notif-item-caption">
                      {{ notif.caption }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side class="notif-time-col">
                    <span class="time-ago">{{ notif.timeAgo }}</span>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div v-else class="notif-empty-state">
              <q-icon name="notifications_off" size="36px" class="empty-icon" />
              <p>{{ t('pos.notifications.empty') }}</p>
            </div>
          </q-menu>
        </button>

        <button
          type="button"
          class="header-tool-btn"
          title="โหมดเต็มหน้าจอ"
          @click="toggleFullscreen"
        >
          <q-icon :name="isFullscreen ? 'fullscreen_exit' : 'fullscreen'" size="20px" />
        </button>
      </div>

      <LocaleSwitcher />
      <PosUserInfo />
    </section>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import PosSearchInput from './pos-search-input.vue';
import PosUserInfo from './pos-user-info.vue';
import LocaleSwitcher from '@/components/base/locale-switcher.vue';
import { useSearchState } from '@/composables/use-search-state';
import { useSidebarState } from '@/composables/use-sidebar-state';

export interface PosNotification {
  id: string;
  title: string;
  caption: string;
  icon: string;
  color: 'primary' | 'positive' | 'warning' | 'negative' | 'info' | 'secondary' | 'amber';
  timeAgo: string;
}

const props = defineProps<{
  searchQuery?: string;
  placeholder?: string;
  hideSearch?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void;
}>();

const route = useRoute();
const $q = useQuasar();
const { locale, t } = useI18n();
const { searchQuery: globalSearchQuery, searchPlaceholder } = useSearchState();
const { isCollapsed, toggleCollapse } = useSidebarState();

const isFullscreen = ref(false);
const now = ref(new Date());
let clockTimer: ReturnType<typeof setInterval> | null = null;

const notifications = ref<PosNotification[]>([
  {
    id: 'n1',
    title: 'ออเดอร์ใหม่ #POS-1042',
    caption: 'Iced Lavender Latte (2) · โต๊ะ 4',
    icon: 'receipt_long',
    color: 'primary',
    timeAgo: '2m',
  },
  {
    id: 'n2',
    title: 'วัตถุดิบใกล้หมด',
    caption: 'Fresh Milk (Meiji) เหลือ 8 ลิตร',
    icon: 'warning',
    color: 'warning',
    timeAgo: '5m',
  },
  {
    id: 'n3',
    title: 'โต๊ะอาหาร พร้อมใช้งาน',
    caption: 'โต๊ะ 8 ทำความสะอาดเรียบร้อยแล้ว',
    icon: 'table_restaurant',
    color: 'positive',
    timeAgo: '12m',
  },
  {
    id: 'n4',
    title: 'ชำระเงินสำเร็จ',
    caption: 'บิล #POS-1041 ฿450 (PromptPay QR)',
    icon: 'payments',
    color: 'positive',
    timeAgo: '18m',
  },
  {
    id: 'n5',
    title: 'คำเตือนห้องครัว',
    caption: 'ออเดอร์ #POS-1039 รอนานเกิน 15 นาที',
    icon: 'timer',
    color: 'negative',
    timeAgo: '25m',
  },
  {
    id: 'n6',
    title: 'สินค้าหมดสต็อก',
    caption: 'Butter Croissant หมดชั่วคราว (0 ชิ้น)',
    icon: 'inventory_2',
    color: 'negative',
    timeAgo: '35m',
  },
  {
    id: 'n7',
    title: 'รีวิวใหม่จากลูกค้า',
    caption: 'ให้ 5 ดาวสำหรับเมนู Kyoto Matcha Latte',
    icon: 'star',
    color: 'amber',
    timeAgo: '42m',
  },
  {
    id: 'n8',
    title: 'รายงานเปลี่ยนกะ',
    caption: 'สรุปยอดกะเช้า พร้อมรับการอนุมัติแล้ว',
    icon: 'badge',
    color: 'info',
    timeAgo: '1h',
  },
  {
    id: 'n9',
    title: 'ออเดอร์ QR สั่งจากโต๊ะ',
    caption: 'ออเดอร์มือถือ #QR-204 โต๊ะ 12 เข้ามาแล้ว',
    icon: 'qr_code_scanner',
    color: 'secondary',
    timeAgo: '1.5h',
  },
  {
    id: 'n10',
    title: 'บรรลุเป้าหมายการขาย',
    caption: 'ยอดขายวันนี้ทะลุ 80% ของเป้าหมายแล้ว!',
    icon: 'emoji_events',
    color: 'amber',
    timeAgo: '2h',
  },
  {
    id: 'n11',
    title: 'สำรองข้อมูลสำเร็จ',
    caption: 'ระบบบันทึกฐานข้อมูล Real-time อัตโนมัติ',
    icon: 'cloud_done',
    color: 'positive',
    timeAgo: '3h',
  },
  {
    id: 'n12',
    title: 'อนุมัติส่วนลดพิเศษ',
    caption: 'ส่วนลดสมาชิก VIP 10% สำหรับ #POS-1035',
    icon: 'local_offer',
    color: 'primary',
    timeAgo: '4h',
  },
  {
    id: 'n13',
    title: 'ลงทะเบียนสมาชิกใหม่',
    caption: 'คุณสมชาย สมัครสมาชิกสะสมแต้มสำเร็จ',
    icon: 'person_add',
    color: 'info',
    timeAgo: '5h',
  },
]);

onMounted(() => {
  clockTimer = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer);
});

const isSearchHidden = computed<boolean>(
  () =>
    props.hideSearch === true || route.name === 'dashboard' || route.path.includes('/dashboard'),
);

const liveFormattedDate = computed(() => {
  return new Intl.DateTimeFormat(locale.value === 'th' ? 'th-TH' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(now.value);
});

const liveHours = computed(() => String(now.value.getHours()).padStart(2, '0'));
const liveMinutes = computed(() => String(now.value.getMinutes()).padStart(2, '0'));
const liveSeconds = computed(() => String(now.value.getSeconds()).padStart(2, '0'));

const onSearchUpdate = (value: string): void => {
  if (props.searchQuery !== undefined) {
    emit('update:searchQuery', value);
  }
  globalSearchQuery.value = value;
};

const onOpenCashDrawer = (): void => {
  $q.notify({
    message: t('pos.openCashDrawerSuccess'),
    color: 'positive',
    position: 'top',
    icon: 'point_of_sale',
  });
};

const onClearAllNotifications = (): void => {
  notifications.value = [];
  $q.notify({
    message: t('pos.notifications.clearAllSuccess'),
    color: 'positive',
    position: 'top',
  });
};

const onSelectNotification = (notif: PosNotification): void => {
  $q.notify({
    message: notif.title,
    caption: notif.caption,
    color: 'primary',
    position: 'top',
    icon: notif.icon,
  });
};

const toggleFullscreen = (): void => {
  if (!document.fullscreenElement) {
    void document.documentElement.requestFullscreen();
    isFullscreen.value = true;
  } else {
    if (document.exitFullscreen) {
      void document.exitFullscreen();
    }
    isFullscreen.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use '../../css/variables' as *;

.pos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: transparent;

  .header-left-group {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-width: 0;

    .sidebar-toggle-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #ffffff;
      border: 1px solid rgba(208, 195, 241, 0.6);
      color: $color-primary-dark;
      box-shadow: 0 3px 10px rgba(99, 88, 128, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.25s ease;

      .toggle-icon {
        font-size: 22px;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &.rotated {
          transform: rotate(180deg);
        }
      }

      &:hover {
        background: $color-primary;
        color: #ffffff;
        border-color: $color-primary;
        box-shadow: 0 4px 14px rgba(99, 88, 128, 0.25);
        transform: scale(1.05);
      }
    }

    :deep(.search-box) {
      max-width: 280px;
      flex-shrink: 1;
    }

    .header-dashboard-widgets {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: nowrap;
      flex-shrink: 0;

      .status-live-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        border-radius: $radius-full;
        background: linear-gradient(
          135deg,
          rgba(240, 253, 244, 0.9) 0%,
          rgba(220, 252, 231, 0.7) 100%
        );
        border: 1px solid rgba(34, 197, 94, 0.3);
        color: #15803d;
        font: 700 12px $font-family-base;
        box-shadow: 0 2px 6px rgba(34, 197, 94, 0.08);
        white-space: nowrap;

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          position: relative;
          flex-shrink: 0;

          &::after {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 50%;
            background: #22c55e;
            opacity: 0.5;
            animation: pulse-dot 2s infinite;
          }
        }
      }

      .clock-live-badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 6px 16px;
        border-radius: $radius-full;
        background: linear-gradient(135deg, #ffffff 0%, rgba(248, 246, 252, 0.9) 100%);
        border: 1px solid rgba(208, 195, 241, 0.6);
        box-shadow: 0 3px 12px rgba(99, 88, 128, 0.08);
        color: $color-text-body;
        white-space: nowrap;

        .clock-icon-stage {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: $palette-purple;
          color: $color-primary-dark;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .clock-info-text {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Plus Jakarta Sans', 'Sarabun', sans-serif;

          .live-date-text {
            color: $color-text-body;
            font-size: 13px;
            font-weight: 600;
          }

          .time-divider {
            color: rgba(99, 88, 128, 0.35);
            font-size: 12px;
          }

          .live-time-text {
            display: inline-flex;
            align-items: center;
            color: $color-primary-dark;
            font-weight: 800;
            font-size: 14px;

            .time-num {
              font-variant-numeric: tabular-nums;
              letter-spacing: 0.3px;
            }

            .time-colon {
              margin: 0 1px;
              opacity: 0.85;
            }
          }
        }
      }
    }
  }

  .user-controls {
    display: flex;
    align-items: center;
    gap: 16px;

    .quick-tools-group {
      display: flex;
      align-items: center;
      gap: 8px;

      .header-tool-btn {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid rgba(208, 195, 241, 0.4);
        background: #ffffff;
        color: $color-text-body;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(99, 88, 128, 0.06);
        transition: all 0.2s ease;

        &:hover {
          background: $palette-purple;
          color: $color-primary-dark;
          border-color: $color-primary;
          transform: translateY(-1px);
        }

        &.drawer-btn:hover {
          background: #e0e7ff;
          color: #3730a3;
          border-color: #6366f1;
        }

        .unread-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          border-radius: 9px;
          background: #ef4444;
          color: #ffffff;
          font:
            800 10px 'Plus Jakarta Sans',
            sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
        }
      }
    }
  }

  @media (max-width: 1200px) {
    .header-left-group {
      .header-dashboard-widgets {
        .live-date-text {
          display: none;
        }
      }
    }
  }

  @media (max-width: 1024px) {
    padding: 10px 16px;
    gap: 12px;

    .header-left-group {
      gap: 10px;

      .header-dashboard-widgets {
        gap: 8px;

        .live-date-text {
          display: none;
        }

        .status-live-badge {
          padding: 4px 10px;
          font-size: 11px;
        }
      }
    }

    .user-controls {
      gap: 10px;

      .quick-tools-group {
        gap: 6px;

        .header-tool-btn {
          width: 36px;
          height: 36px;
        }
      }
    }
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    gap: 8px;

    .header-left-group {
      gap: 8px;

      .header-dashboard-widgets {
        .status-live-badge .status-text {
          display: none;
        }

        .status-live-badge {
          padding: 6px;
        }

        .clock-live-badge {
          padding: 4px 10px;

          .live-date-text {
            display: none;
          }

          .live-time-text {
            font-size: 13px;
          }
        }
      }
    }

    .user-controls {
      gap: 6px;

      .quick-tools-group {
        gap: 4px;

        .header-tool-btn {
          width: 34px;
          height: 34px;
        }
      }
    }
  }

  @media (max-width: 480px) {
    padding: 6px 8px;

    .header-left-group {
      .sidebar-toggle-btn {
        width: 34px;
        height: 34px;

        .toggle-icon {
          font-size: 18px;
        }
      }
    }
  }
}

@keyframes pulse-dot {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>

<style lang="scss">
.notifications-menu {
  width: 340px;
  border-radius: 18px !important;
  box-shadow: 0 16px 40px rgba(99, 88, 128, 0.18) !important;
  padding: 0 !important;
  overflow: hidden !important;
  border: 1px solid rgba(208, 195, 241, 0.6) !important;
  background: #ffffff !important;

  .notif-header {
    padding: 14px 18px;
    background: linear-gradient(135deg, #ffffff 0%, #f9f8fc 100%);
    border-bottom: 1px solid rgba(208, 195, 241, 0.4);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .notif-title-box {
      display: flex;
      align-items: center;
      gap: 8px;

      strong {
        color: #1e1b4b;
        font:
          700 15px 'Plus Jakarta Sans',
          'Sarabun',
          sans-serif;
      }

      .notif-count-pill {
        background: #f4f0ff;
        color: #635880;
        font:
          700 11px 'Plus Jakarta Sans',
          'Sarabun',
          sans-serif;
        padding: 2px 8px;
        border-radius: 12px;
      }
    }

    .clear-all-btn {
      border: none;
      background: transparent;
      color: #ef4444;
      font:
        600 12px 'Plus Jakarta Sans',
        'Sarabun',
        sans-serif;
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      transition: background 0.15s ease;

      &:hover {
        background: #fef2f2;
      }
    }
  }

  .notif-scroll-container {
    max-height: 285px;
    overflow-y: auto;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background: #f4f4f5;
    }

    &::-webkit-scrollbar-thumb {
      background: #d4d4d8;
      border-radius: 4px;

      &:hover {
        background: #a1a1aa;
      }
    }

    .notif-list {
      padding: 0;

      .notif-item {
        padding: 12px 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.03);
        transition: background-color 0.15s ease;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          background-color: #f8f6fc;
        }

        .notif-avatar-col {
          min-width: 0;
          padding-right: 12px;

          .notif-icon-box {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            &.primary {
              background: #f4f0ff;
              color: #635880;
            }
            &.positive {
              background: #f0fdf4;
              color: #16a34a;
            }
            &.warning {
              background: #fffbeb;
              color: #d97706;
            }
            &.negative {
              background: #fef2f2;
              color: #dc2626;
            }
            &.info {
              background: #f0f9ff;
              color: #0284c7;
            }
            &.secondary {
              background: #fdf4ff;
              color: #c026d3;
            }
            &.amber {
              background: #fff8f0;
              color: #b45309;
            }
          }
        }

        .notif-content-col {
          .notif-item-title {
            font:
              700 13px 'Plus Jakarta Sans',
              'Sarabun',
              sans-serif;
            color: #18181b;
            line-height: 1.3;
          }

          .notif-item-caption {
            font:
              500 12px 'Plus Jakarta Sans',
              'Sarabun',
              sans-serif;
            color: #71717a;
            margin-top: 2px;
          }
        }

        .notif-time-col {
          padding-left: 8px;
          align-self: flex-start;

          .time-ago {
            font:
              600 11px 'Plus Jakarta Sans',
              sans-serif;
            color: #a1a1aa;
          }
        }
      }
    }
  }

  .notif-empty-state {
    padding: 32px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #a1a1aa;

    .empty-icon {
      opacity: 0.6;
    }

    p {
      margin: 0;
      font:
        600 13px 'Plus Jakarta Sans',
        'Sarabun',
        sans-serif;
    }
  }
}
</style>

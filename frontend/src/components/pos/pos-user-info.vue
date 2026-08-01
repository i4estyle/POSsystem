<template>
  <section class="user-profile-wrapper">
    <div class="user-profile-card">
      <div class="avatar-container">
        <template v-if="currentUser?.profileImage">
          <img :src="currentUser.profileImage" class="avatar-img" alt="Profile" />
        </template>
        <template v-else>
          <span class="avatar-initials">{{ initials }}</span>
        </template>
        <span class="online-indicator" aria-hidden="true" />
      </div>

      <div class="user-details">
        <span class="user-name">{{ displayName }}</span>
        <span class="user-role-badge">{{ roleDisplay }}</span>
      </div>
      <q-icon name="keyboard_arrow_down" size="18px" class="dropdown-chevron" />

      <q-menu
        auto-close
        class="user-profile-dropdown-menu"
        anchor="bottom right"
        self="top right"
        :offset="[0, 8]"
      >
        <div class="menu-header-banner">
          <div class="header-user-info">
            <div class="header-name">{{ displayName }}</div>
            <div class="header-email">{{ currentUser?.email || currentUser?.username }}</div>
            <div class="header-branch-pill">
              <q-icon name="storefront" size="12px" /> {{ currentBranchName }}
            </div>
          </div>
          <span class="header-role-pill">{{ roleDisplay }}</span>
        </div>

        <q-list class="menu-list">
          <q-item clickable v-close-popup class="menu-item" @click="openEditModal">
            <q-item-section avatar class="item-icon-sec">
              <div class="icon-circle primary-icon">
                <q-icon name="person" size="16px" />
              </div>
            </q-item-section>
            <q-item-section class="item-text-sec">
              {{ $t('pos.editProfile') }}
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" size="16px" color="grey-6" />
            </q-item-section>
          </q-item>

          <q-separator class="menu-separator" />

          <q-item clickable v-close-popup class="menu-item logout-item" @click="handleLogout">
            <q-item-section avatar class="item-icon-sec">
              <div class="icon-circle negative-icon">
                <q-icon name="logout" size="16px" />
              </div>
            </q-item-section>
            <q-item-section class="item-text-sec text-negative">
              {{ $t('pos.logout') }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>

    <PosProfileDialog
      v-model="showEditModal"
      :user="currentUser"
      :loading="authStore.isLoading"
      @save="saveProfile"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import PosProfileDialog from '@/components/pos/pos-profile-dialog.vue';

const router = useRouter();
const $q = useQuasar();
const { t } = useI18n();
const authStore = useAuthStore();

const showEditModal = ref(false);

const currentUser = computed(() => authStore.currentUser);

const displayName = computed((): string => {
  const user = currentUser.value;
  if (!user) return 'Staff User';
  return `${user.firstName} ${user.lastName}`.trim();
});

const roleDisplay = computed((): string => {
  const user = currentUser.value;
  if (!user) return 'CASHIER';
  if (user.roleId === 1) return 'ADMIN';
  return `CASHIER #${String(user.employeeId).padStart(2, '0')}`;
});

const currentBranchName = computed((): string => {
  const user = currentUser.value;
  return (
    user?.branchName ||
    user?.branch?.branchName ||
    (user?.branchId ? `สาขา #${user.branchId}` : 'สาขาหลัก')
  );
});

const initials = computed((): string => {
  const user = currentUser.value;
  if (!user) return 'SU';
  const first = user.firstName?.[0] || '';
  const last = user.lastName?.[0] || '';
  return `${first}${last}`.toUpperCase() || 'U';
});

const openEditModal = (): void => {
  showEditModal.value = true;
};

const saveProfile = async (payload: {
  titlePrefix: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  profileImage: string;
}): Promise<void> => {
  try {
    await authStore.updateProfile(payload);
    showEditModal.value = false;
    $q.notify({
      type: 'positive',
      message: t('pos.profileUpdatedSuccess'),
      position: 'top',
    });
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Failed to update profile',
      position: 'top',
    });
  }
};

const handleLogout = (): void => {
  authStore.logout();
  void router.push('/login');
};
</script>

<style scoped lang="scss">
.user-profile-wrapper {
  position: relative;
  display: inline-block;

  .user-profile-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 12px 4px 5px;
    border-radius: 28px;
    background-color: #ffffff;
    border: 1px solid #e4e4e7;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.04);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      background-color: #fafafa;
      border-color: #d4d4d8;
      box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }

    .avatar-container {
      position: relative;
      width: 38px;
      height: 38px;

      .avatar-img {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #ffffff;
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
      }

      .avatar-initials {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: linear-gradient(135deg, #635880 0%, #4a3e68 100%);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 700;
        font-size: 13px;
        box-shadow: 0px 2px 6px rgba(99, 88, 128, 0.3);
      }

      .online-indicator {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #22c55e;
        border: 2px solid #ffffff;
      }
    }

    .user-details {
      display: flex;
      flex-direction: column;
      text-align: left;
      gap: 1px;

      .user-name {
        font-family: 'Plus Jakarta Sans', 'Sarabun', sans-serif;
        font-size: 13.5px;
        font-weight: 700;
        color: #18181b;
        line-height: 1.2;
      }

      .user-role-badge {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 9.5px;
        font-weight: 700;
        color: #635880;
        background-color: rgba(99, 88, 128, 0.08);
        border-radius: 4px;
        padding: 1px 5px;
        line-height: 1.2;
        width: fit-content;
      }
    }

    .dropdown-chevron {
      color: #71717a;
      transition: transform 0.2s ease;
    }
  }
}

.user-profile-dropdown-menu {
  border-radius: 20px !important;
  box-shadow: 0px 20px 40px -10px rgba(0, 0, 0, 0.18) !important;
  border: 1px solid #f4f4f5 !important;
  overflow: hidden;
  width: 240px;

  .menu-header-banner {
    padding: 16px;
    background: linear-gradient(135deg, #635880 0%, #4a3e68 100%);
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .header-user-info {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .header-name {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
      }

      .header-email {
        font-family: 'Sarabun', sans-serif;
        font-size: 11.5px;
        color: rgba(255, 255, 255, 0.8);
        word-break: break-all;
      }

      .header-branch-pill {
        font-family: 'Sarabun', sans-serif;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 4px;
      }
    }

    .header-role-pill {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 9px;
      font-weight: 800;
      color: #635880;
      background: #ffffff;
      padding: 2px 6px;
      border-radius: 6px;
    }
  }

  .menu-list {
    padding: 6px;

    .menu-item {
      border-radius: 12px;
      padding: 8px 12px;
      transition: all 0.15s ease;

      &:hover {
        background-color: #f4f4f5;

        .item-text-sec {
          transform: translateX(2px);
        }
      }

      .item-icon-sec {
        min-width: 36px;
        padding-right: 14px;

        .icon-circle {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;

          &.primary-icon {
            background-color: rgba(99, 88, 128, 0.1);
            color: #635880;
          }

          &.info-icon {
            background-color: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
          }

          &.negative-icon {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
          }
        }
      }

      .item-text-sec {
        font-family: 'Sarabun', sans-serif;
        font-size: 13px;
        font-weight: 600;
        color: #27272a;
        padding-left: 2px;
        transition: transform 0.15s ease;
      }
    }

    .menu-separator {
      margin: 4px 6px;
    }
  }
}

.edit-profile-dialog-card {
  width: 90vw;
  max-width: 540px;
  border-radius: 24px;
  overflow: hidden;
  background-color: #ffffff;

  .dialog-top-gradient {
    height: 6px;
    width: 100%;
    background: linear-gradient(90deg, #635880 0%, #ec4899 50%, #3b82f6 100%);
  }

  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 8px 20px;

    .header-title-block {
      display: flex;
      align-items: center;
      gap: 12px;

      .title-icon-badge {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: linear-gradient(135deg, #635880 0%, #4a3e68 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 4px 12px rgba(99, 88, 128, 0.3);
      }
    }
  }

  .dialog-body {
    padding: 12px 20px 20px 20px;

    .avatar-upload-block {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;

      .avatar-ring {
        position: relative;
        width: 84px;
        height: 84px;

        .avatar-large {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #ffffff;
          box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.12);
        }

        .avatar-large-initials {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          background: linear-gradient(135deg, #635880 0%, #4a3e68 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 26px;
          font-weight: 700;
          border: 3px solid #ffffff;
          box-shadow: 0px 8px 20px rgba(99, 88, 128, 0.3);
        }

        .camera-overlay-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #635880 0%, #4a3e68 100%);
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
          transition: transform 0.15s ease;

          &:hover {
            transform: scale(1.1);
          }
        }
      }

      .hidden-file-input {
        display: none;
      }
    }

    .profile-form-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .form-row-name {
        display: flex;
        gap: 8px;

        .prefix-select-box {
          width: 100px;
        }

        .name-field {
          flex: 1;
        }
      }

      .form-row-contact {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;

        @media (max-width: 500px) {
          grid-template-columns: 1fr;
        }
      }
    }
  }

  .dialog-footer {
    padding: 12px 20px;
    background-color: #fafafa;
    border-top: 1px solid #f4f4f5;

    .cancel-btn {
      font-weight: 600;
      font-size: 13.5px;
      color: #52525b !important;
      background-color: #f4f4f5 !important;
      border: 1px solid #e4e4e7 !important;
      border-radius: 12px;
      padding: 0 18px;
      height: 40px;
      transition: all 0.15s ease;

      &:hover {
        background-color: #e4e4e7 !important;
        color: #27272a !important;
      }
    }

    .save-btn {
      font-weight: 700;
      border-radius: 12px;
      padding: 0 20px;
      height: 40px;
      background: linear-gradient(135deg, #635880 0%, #4a3e68 100%) !important;
      box-shadow: 0px 6px 16px rgba(99, 88, 128, 0.35);
    }
  }
}
</style>

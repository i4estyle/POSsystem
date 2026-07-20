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

          <q-item
            v-if="!isSystemSelectionPage"
            clickable
            v-close-popup
            class="menu-item"
            @click="goToSystemSelection"
          >
            <q-item-section avatar class="item-icon-sec">
              <div class="icon-circle info-icon">
                <q-icon name="apps" size="16px" />
              </div>
            </q-item-section>
            <q-item-section class="item-text-sec"> {{ $t('pos.selectSystem') }} </q-item-section>
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

    <q-dialog v-model="showEditModal" persistent transition-show="scale" transition-hide="scale">
      <q-card class="edit-profile-dialog-card">
        <div class="dialog-top-gradient" />

        <q-card-section class="dialog-header">
          <div class="header-title-block">
            <div class="title-icon-badge">
              <q-icon name="manage_accounts" size="22px" color="white" />
            </div>
            <div class="title-text-group">
              <div class="text-h6 text-weight-bold text-dark">
                {{ $t('pos.editProfileTitle') }}
              </div>
              <div class="text-caption text-grey-7">{{ $t('pos.editProfileSubtitle') }}</div>
            </div>
          </div>
          <q-btn v-close-popup icon="close" flat round dense color="grey-7" />
        </q-card-section>

        <q-card-section class="dialog-body">
          <div class="avatar-upload-block">
            <div class="avatar-ring">
              <img
                v-if="editProfileImage"
                :src="editProfileImage"
                class="avatar-large"
                alt="Avatar"
              />
              <span v-else class="avatar-large-initials">{{ editInitials }}</span>

              <button type="button" class="camera-overlay-btn" @click="triggerFileInput">
                <q-icon name="photo_camera" size="18px" color="white" />
              </button>
            </div>
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              class="hidden-file-input"
              @change="onFileSelected"
            />
          </div>

          <div class="profile-form-grid">
            <div class="form-row-name">
              <q-select
                v-model="editTitlePrefix"
                :options="titlePrefixOptions"
                outlined
                dense
                options-dense
                behavior="menu"
                :label="$t('auth.titlePrefixLabel')"
                class="prefix-select-box"
              />
              <q-input
                v-model="editFirstName"
                outlined
                dense
                :label="$t('auth.firstNameLabel')"
                class="name-field"
              />
              <q-input
                v-model="editLastName"
                outlined
                dense
                :label="$t('auth.lastNameLabel')"
                class="name-field"
              />
            </div>

            <div class="form-row-contact">
              <q-input v-model="editPhone" outlined dense :label="$t('auth.phoneLabel')">
                <template #prepend>
                  <q-icon name="phone" size="18px" color="grey-6" />
                </template>
              </q-input>
              <q-input v-model="editEmail" outlined dense :label="$t('auth.emailLabel')">
                <template #prepend>
                  <q-icon name="email" size="18px" color="grey-6" />
                </template>
              </q-input>
            </div>

            <q-input
              v-model="editAddress"
              outlined
              dense
              type="textarea"
              rows="2"
              :label="$t('auth.addressLabel')"
            >
              <template #prepend>
                <q-icon name="place" size="18px" color="grey-6" />
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="dialog-footer">
          <q-btn v-close-popup flat :label="$t('pos.cancel')" no-caps class="cancel-btn" />
          <q-btn
            color="primary"
            :label="$t('pos.saveChanges')"
            no-caps
            class="save-btn"
            :loading="authStore.isLoading"
            @click="saveProfile"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCropModal">
      <AppImageCropper
        v-if="rawImageSrc"
        :image-src="rawImageSrc"
        circular
        @confirm="onCroppedFile"
        @cancel="showCropModal = false"
      />
    </q-dialog>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import AppImageCropper from '@/components/base/app-image-cropper.vue';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const { t } = useI18n();
const authStore = useAuthStore();

const isSystemSelectionPage = computed(() => route.path === '/system-selection');

const fileInputRef = ref<HTMLInputElement | null>(null);

const showEditModal = ref(false);
const showCropModal = ref(false);
const rawImageSrc = ref('');

const editTitlePrefix = ref('นาย');
const editFirstName = ref('');
const editLastName = ref('');
const editPhone = ref('');
const editEmail = ref('');
const editAddress = ref('');
const editProfileImage = ref('');

const titlePrefixOptions = ['นาย', 'นาง', 'นางสาว', 'Mr.', 'Mrs.', 'Ms.'];

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

const editInitials = computed((): string => {
  const first = editFirstName.value?.[0] || '';
  const last = editLastName.value?.[0] || '';
  return `${first}${last}`.toUpperCase() || 'U';
});

const openEditModal = (): void => {
  const user = currentUser.value;
  if (user) {
    editTitlePrefix.value = user.titlePrefix || 'นาย';
    editFirstName.value = user.firstName || '';
    editLastName.value = user.lastName || '';
    editPhone.value = user.phone || '';
    editEmail.value = user.email || '';
    editAddress.value = user.address || '';
    editProfileImage.value = user.profileImage || '';
  }
  showEditModal.value = true;
};

const goToSystemSelection = (): void => {
  void router.push('/system-selection');
};

const triggerFileInput = (): void => {
  fileInputRef.value?.click();
};

const onFileSelected = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    $q.notify({
      type: 'warning',
      message: t('auth.fileSizeLimit'),
      position: 'top',
    });
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    rawImageSrc.value = (e.target?.result as string) || '';
    showCropModal.value = true;
  };
  reader.readAsDataURL(file);
};

const onCroppedFile = (croppedFile: File): void => {
  const reader = new FileReader();
  reader.onload = (e) => {
    editProfileImage.value = (e.target?.result as string) || '';
    rawImageSrc.value = '';
    showCropModal.value = false;
  };
  reader.readAsDataURL(croppedFile);
};

const saveProfile = async (): Promise<void> => {
  try {
    await authStore.updateProfile({
      titlePrefix: editTitlePrefix.value,
      firstName: editFirstName.value,
      lastName: editLastName.value,
      phone: editPhone.value,
      email: editEmail.value,
      address: editAddress.value,
      profileImage: editProfileImage.value,
    });
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

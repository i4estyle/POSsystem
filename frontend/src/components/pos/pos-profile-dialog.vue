<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="app-dialog-card pos-profile-dialog-card">
      <AppDialogHeader
        :title="$t('pos.editProfileTitle')"
        :subtitle="$t('pos.editProfileSubtitle')"
        icon="manage_accounts"
      />

      <main class="dialog-body">
        <div class="avatar-upload-block">
          <div class="avatar-ring">
            <img v-if="profileImage" :src="profileImage" class="avatar-large" alt="Avatar" />
            <span v-else class="avatar-large-initials">{{ initials }}</span>

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
            <AppFormField :label="$t('auth.titlePrefixLabel')" class="prefix-select-box">
              <q-select
                v-model="form.titlePrefix"
                :options="titlePrefixOptions"
                outlined
                dense
                options-dense
                behavior="menu"
                class="custom-select"
              />
            </AppFormField>

            <AppFormField :label="$t('auth.firstNameLabel')" class="name-field">
              <q-input v-model="form.firstName" outlined dense class="custom-input" />
            </AppFormField>

            <AppFormField :label="$t('auth.lastNameLabel')" class="name-field">
              <q-input v-model="form.lastName" outlined dense class="custom-input" />
            </AppFormField>
          </div>

          <div class="form-row-contact">
            <AppFormField :label="$t('auth.phoneLabel')">
              <q-input v-model="form.phone" outlined dense class="custom-input">
                <template #prepend>
                  <q-icon name="phone" size="18px" class="prefix-icon" />
                </template>
              </q-input>
            </AppFormField>

            <AppFormField :label="$t('auth.emailLabel')">
              <q-input v-model="form.email" outlined dense class="custom-input">
                <template #prepend>
                  <q-icon name="email" size="18px" class="prefix-icon" />
                </template>
              </q-input>
            </AppFormField>
          </div>

          <AppFormField :label="$t('auth.addressLabel')">
            <q-input
              v-model="form.address"
              outlined
              dense
              type="textarea"
              rows="2"
              class="custom-input"
            >
              <template #prepend>
                <q-icon name="place" size="18px" class="prefix-icon" />
              </template>
            </q-input>
          </AppFormField>
        </div>
      </main>

      <footer class="dialog-actions">
        <button v-close-popup type="button" class="btn-cancel">
          {{ $t('pos.cancel') }}
        </button>

        <GradientButton
          :label="$t('pos.saveChanges')"
          icon="check"
          variant="primary"
          :disabled="loading"
          @click="onSave"
        />
      </footer>
    </q-card>

    <q-dialog v-model="showCropModal">
      <AppImageCropper
        v-if="rawImageSrc"
        :image-src="rawImageSrc"
        circular
        @confirm="onCroppedFile"
        @cancel="showCropModal = false"
      />
    </q-dialog>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import type { AuthUser } from '@/types/auth';
import AppDialogHeader from '@/components/base/app-dialog-header.vue';
import AppFormField from '@/components/base/app-form-field.vue';
import GradientButton from '@/components/base/gradient-button.vue';
import AppImageCropper from '@/components/base/app-image-cropper.vue';

const $q = useQuasar();
const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  user: AuthUser | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (
    e: 'save',
    payload: {
      titlePrefix: string;
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      address: string;
      profileImage: string;
    },
  ): void;
}>();

const titlePrefixOptions = ['นาย', 'นาง', 'นางสาว', 'Mr.', 'Mrs.', 'Ms.'];
const fileInputRef = ref<HTMLInputElement | null>(null);
const showCropModal = ref(false);
const rawImageSrc = ref('');

const form = ref({
  titlePrefix: 'นาย',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
});

const profileImage = ref('');

const initials = computed((): string => {
  const first = form.value.firstName?.[0] || '';
  const last = form.value.lastName?.[0] || '';
  return `${first}${last}`.toUpperCase() || 'U';
});

watch(
  () => [props.user, props.modelValue],
  ([u, isOpen]) => {
    if (isOpen && u) {
      const usr = u as NonNullable<typeof props.user>;
      form.value = {
        titlePrefix: usr.titlePrefix || 'นาย',
        firstName: usr.firstName || '',
        lastName: usr.lastName || '',
        phone: usr.phone || '',
        email: usr.email || '',
        address: usr.address || '',
      };
      profileImage.value = usr.profileImage || '';
    }
  },
  { immediate: true },
);

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
    profileImage.value = (e.target?.result as string) || '';
    rawImageSrc.value = '';
    showCropModal.value = false;
  };
  reader.readAsDataURL(croppedFile);
};

const onSave = (): void => {
  emit('save', {
    ...form.value,
    profileImage: profileImage.value,
  });
};
</script>

<style lang="scss">
@use '../../css/variables' as *;

.pos-profile-dialog-card {
  width: 520px;
  max-width: 95vw;

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
        box-shadow: 0 8px 20px rgba(99, 88, 128, 0.15);
      }

      .avatar-large-initials {
        width: 84px;
        height: 84px;
        border-radius: 50%;
        background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font: 700 26px $font-family-base;
        border: 3px solid #ffffff;
        box-shadow: 0 8px 20px rgba(99, 88, 128, 0.25);
      }

      .camera-overlay-btn {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
        border: 2px solid #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        transition: transform 0.15s ease;

        &:hover {
          transform: scale(1.08);
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
    gap: 14px;

    .form-row-name {
      display: flex;
      gap: 12px;

      .prefix-select-box {
        width: 105px;
      }

      .name-field {
        flex: 1;
      }
    }

    .form-row-contact {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      @media (max-width: 500px) {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>

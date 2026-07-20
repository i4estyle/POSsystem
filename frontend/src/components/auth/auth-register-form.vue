<template>
  <q-form ref="registerFormRef" class="auth-register-form" @submit.prevent="handleRegister">
    <div class="registration-upload-header">
      <div
        class="profile-upload-zone"
        :class="{ 'has-image': !!profileImage }"
        @click="triggerFileInput"
      >
        <input
          ref="fileInputRef"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          class="hidden-file-input"
          @change="onFileSelected"
        />
        <div v-if="profileImage" class="preview-wrapper">
          <img :src="profileImage" class="avatar-preview-img" alt="Profile Preview" />
          <div class="remove-avatar-btn" @click.stop="removeProfileImage">
            <q-icon name="close" size="16px" />
          </div>
        </div>
        <div v-else class="upload-placeholder">
          <q-icon name="add_a_photo" size="32px" class="upload-icon" />
          <span class="upload-text">{{ $t('auth.uploadPhotoBox') }}</span>
        </div>
      </div>

      <div class="upload-guidelines-card">
        <div class="guidelines-title">{{ $t('auth.uploadTitle') }}</div>
        <ul class="guidelines-list">
          <li>{{ $t('auth.uploadGuideline1') }}</li>
          <li>{{ $t('auth.uploadGuideline2') }}</li>
          <li>{{ $t('auth.uploadGuideline3') }}</li>
          <li>{{ $t('auth.uploadGuideline4') }}</li>
          <li>{{ $t('auth.uploadGuideline5') }}</li>
          <li>{{ $t('auth.uploadGuideline6') }}</li>
        </ul>
      </div>
    </div>

    <div class="registration-form-grid">
      <div class="form-row-3col">
        <div class="form-field title-prefix-field">
          <label class="field-label" for="reg-title-prefix">{{
            $t('auth.titlePrefixLabel')
          }}</label>
          <q-select
            id="reg-title-prefix"
            v-model="titlePrefix"
            :options="titlePrefixOptions"
            outlined
            dense
            options-dense
            behavior="menu"
            popup-content-class="custom-select-menu"
            class="custom-auth-input custom-auth-select"
            :class="{ 'is-empty': !titlePrefix }"
            :display-value="titlePrefix || $t('auth.titlePrefixPlaceholder')"
          />
        </div>
        <div class="form-field">
          <label class="field-label" for="reg-first-name">{{ $t('auth.firstNameLabel') }}</label>
          <q-input
            id="reg-first-name"
            v-model="firstName"
            outlined
            dense
            class="custom-auth-input"
            :placeholder="$t('auth.firstNamePlaceholder')"
            :rules="[(val) => !!val || $t('auth.firstNamePlaceholder')]"
            lazy-rules
          />
        </div>
        <div class="form-field">
          <label class="field-label" for="reg-last-name">{{ $t('auth.lastNameLabel') }}</label>
          <q-input
            id="reg-last-name"
            v-model="lastName"
            outlined
            dense
            class="custom-auth-input"
            :placeholder="$t('auth.lastNamePlaceholder')"
            :rules="[(val) => !!val || $t('auth.lastNamePlaceholder')]"
            lazy-rules
          />
        </div>
      </div>

      <div class="form-row-3col">
        <div class="form-field">
          <label class="field-label" for="reg-national-id">{{ $t('auth.nationalIdLabel') }}</label>
          <q-input
            id="reg-national-id"
            v-model="nationalId"
            outlined
            dense
            maxlength="13"
            class="custom-auth-input"
            :placeholder="$t('auth.nationalIdPlaceholder')"
            :rules="[
              (val) => !!val || $t('auth.nationalIdPlaceholder'),
              (val) => /^[0-9]{13}$/.test(val) || $t('auth.nationalIdRule'),
              checkNationalIdRule,
            ]"
            lazy-rules
            @update:model-value="onUpdateNationalId"
          />
        </div>
        <div class="form-field">
          <label class="field-label" for="reg-phone">{{ $t('auth.phoneLabel') }}</label>
          <q-input
            id="reg-phone"
            v-model="phone"
            outlined
            dense
            maxlength="10"
            class="custom-auth-input"
            :placeholder="$t('auth.phonePlaceholder')"
            :rules="[
              (val) => !!val || $t('auth.phonePlaceholder'),
              (val) => /^[0-9]{10}$/.test(val) || $t('auth.phoneRule'),
            ]"
            lazy-rules
            @update:model-value="onUpdatePhone"
          />
        </div>
        <div class="form-field">
          <label class="field-label" for="reg-email">{{ $t('auth.emailLabel') }}</label>
          <q-input
            id="reg-email"
            v-model="email"
            type="email"
            outlined
            dense
            class="custom-auth-input"
            :placeholder="$t('auth.emailPlaceholder')"
            :rules="[
              (val) => !!val || $t('auth.emailPlaceholder'),
              (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || $t('auth.emailRule'),
              checkEmailRule,
            ]"
            lazy-rules
          />
        </div>
      </div>

      <div class="form-row-3col">
        <div class="form-field">
          <label class="field-label" for="reg-username">{{ $t('auth.usernameLabel') }}</label>
          <q-input
            id="reg-username"
            v-model="username"
            outlined
            dense
            class="custom-auth-input"
            :placeholder="$t('auth.usernamePlaceholder')"
            :rules="[(val) => !!val || $t('auth.usernamePlaceholder'), checkUsernameRule]"
            lazy-rules
          />
        </div>
        <div class="form-field">
          <label class="field-label" for="reg-password">{{ $t('auth.passwordLabel') }}</label>
          <q-input
            id="reg-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            outlined
            dense
            class="custom-auth-input"
            :placeholder="$t('auth.passwordPlaceholder')"
            :rules="[
              (val) => !!val || $t('auth.passwordPlaceholder'),
              (val) => (val && val.length >= 6) || $t('auth.passwordMinRule'),
            ]"
            lazy-rules
          >
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer input-icon"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
        </div>
        <div class="form-field">
          <label class="field-label" for="reg-branch">{{ $t('auth.branchLabel') }}</label>
          <q-select
            id="reg-branch"
            v-model="selectedBranchId"
            :options="branchOptions"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            outlined
            dense
            options-dense
            behavior="menu"
            popup-content-class="custom-select-menu"
            class="custom-auth-input custom-auth-select"
            :class="{ 'is-empty': selectedBranchId === null }"
            :display-value="selectedBranchId !== null ? undefined : 'เลือกสาขา'"
            :rules="[(val) => !!val || $t('auth.branchRequired')]"
            lazy-rules
          />
        </div>
      </div>

      <div class="form-field address-full-field">
        <label class="field-label" for="reg-address">{{ $t('auth.addressLabel') }}</label>
        <q-input
          id="reg-address"
          v-model="address"
          type="textarea"
          rows="2"
          outlined
          dense
          class="custom-auth-input address-textarea-input"
          :placeholder="$t('auth.addressPlaceholder')"
          :rules="[(val) => !!val || $t('auth.addressPlaceholder')]"
          lazy-rules
        />
      </div>
    </div>

    <q-btn type="submit" class="auth-submit-btn" :loading="authStore.isLoading" no-caps unelevated>
      <span>{{ $t('auth.submitRegister') }}</span>
    </q-btn>

    <q-dialog v-model="showCropModal" persistent transition-show="scale" transition-hide="scale">
      <AppImageCropper
        v-if="showCropModal"
        :image-src="rawImageSrc"
        circular
        @confirm="onCroppedFile"
        @cancel="showCropModal = false"
      />
    </q-dialog>
  </q-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, type QForm } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { branchService } from '@/services/branch-service';
import { authService } from '@/services/auth-service';
import AppImageCropper from '@/components/base/app-image-cropper.vue';
import type { RegisterPayload } from '@/types/auth';

const router = useRouter();
const $q = useQuasar();
const { t } = useI18n();
const authStore = useAuthStore();

const registerFormRef = ref<QForm | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const firstName = ref('');
const lastName = ref('');
const phone = ref('');
const email = ref('');
const username = ref('');
const password = ref('');
const nationalId = ref('');
const address = ref('');
const titlePrefix = ref<string | null>(null);
const profileImage = ref<string>('');
const showPassword = ref(false);

const selectedBranchId = ref<number | null>(null);
const branchOptions = ref<{ label: string; value: number }[]>([]);

const showCropModal = ref(false);
const rawImageSrc = ref('');

const titlePrefixOptions = ['นาย', 'นาง', 'นางสาว', 'Mr.', 'Mrs.', 'Ms.'];

let branchOptionsCache: { label: string; value: number }[] | null = null;

onMounted(async () => {
  if (branchOptionsCache && branchOptionsCache.length > 0) {
    branchOptions.value = branchOptionsCache;
    return;
  }
  try {
    const res = await branchService.getAll(1, 100);
    if (res && Array.isArray(res.data)) {
      branchOptionsCache = res.data.map((b) => ({
        label: b.branchName,
        value: b.branchId,
      }));
      branchOptions.value = branchOptionsCache;
    }
  } catch {
    branchOptionsCache = [{ label: 'สาขาหลัก (Main Branch)', value: 1 }];
    branchOptions.value = branchOptionsCache;
  }
});

const checkUsernameRule = async (val: string): Promise<boolean | string> => {
  if (!val || !val.trim()) return true;
  try {
    const res = await authService.checkAvailability('username', val.trim());
    if (!res.available) {
      return res.message || 'ชื่อผู้ใช้งานนี้ถูกใช้งานในระบบแล้ว';
    }
  } catch {
    //
  }
  return true;
};

const checkEmailRule = async (val: string): Promise<boolean | string> => {
  if (!val || !val.trim()) return true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return true;
  try {
    const res = await authService.checkAvailability('email', val.trim());
    if (!res.available) {
      return res.message || 'อีเมลนี้ถูกใช้งานในระบบแล้ว';
    }
  } catch {
    //
  }
  return true;
};

const checkNationalIdRule = async (val: string): Promise<boolean | string> => {
  if (!val || !val.trim()) return true;
  if (!/^[0-9]{13}$/.test(val.trim())) return true;
  try {
    const res = await authService.checkAvailability('nationalId', val.trim());
    if (!res.available) {
      return res.message || 'เลขบัตรประจำตัวประชาชนนี้ถูกใช้งานในระบบแล้ว';
    }
  } catch {
    //
  }
  return true;
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
    profileImage.value = (e.target?.result as string) || '';
    rawImageSrc.value = '';
    showCropModal.value = false;
    $q.notify({
      type: 'positive',
      message: t('auth.photoSavedSuccess'),
      position: 'top',
    });
  };
  reader.readAsDataURL(croppedFile);
};

const removeProfileImage = (): void => {
  profileImage.value = '';
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const onUpdateNationalId = (val: string | number | null): void => {
  const str = String(val || '');
  nationalId.value = str.replace(/\D/g, '').slice(0, 13);
};

const onUpdatePhone = (val: string | number | null): void => {
  const str = String(val || '');
  phone.value = str.replace(/\D/g, '').slice(0, 10);
};

const handleRegister = async (): Promise<void> => {
  if (registerFormRef.value) {
    const isValid = await registerFormRef.value.validate();
    if (!isValid) {
      const components = registerFormRef.value.getValidationComponents() as unknown as Array<{
        hasError?: boolean;
        focus?: () => void;
      }>;
      const firstInvalid = components.find((comp) => comp.hasError);
      if (firstInvalid && typeof firstInvalid.focus === 'function') {
        firstInvalid.focus();
      }
      return;
    }
  }
  if (!phone.value || phone.value.length !== 10) {
    $q.notify({
      type: 'warning',
      message: t('auth.phoneRule'),
      position: 'top',
    });
    return;
  }

  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    $q.notify({
      type: 'warning',
      message: t('auth.emailRule'),
      position: 'top',
    });
    return;
  }

  if (!nationalId.value || nationalId.value.length !== 13) {
    $q.notify({
      type: 'warning',
      message: t('auth.nationalIdRule'),
      position: 'top',
    });
    return;
  }

  if (!address.value.trim()) {
    $q.notify({
      type: 'warning',
      message: t('auth.addressRequired'),
      position: 'top',
    });
    return;
  }

  if (!selectedBranchId.value) {
    $q.notify({
      type: 'warning',
      message: t('auth.branchRequired'),
      position: 'top',
    });
    return;
  }

  const payload: RegisterPayload = {
    firstName: firstName.value,
    lastName: lastName.value,
    phone: phone.value,
    email: email.value,
    username: username.value,
    password: password.value,
    branchId: selectedBranchId.value,
    roleId: 2,
  };

  if (nationalId.value) {
    payload.nationalId = nationalId.value;
  }
  if (address.value) {
    payload.address = address.value;
  }
  if (titlePrefix.value) {
    payload.titlePrefix = titlePrefix.value;
  }
  if (profileImage.value) {
    payload.profileImage = profileImage.value;
  }

  try {
    await authStore.register(payload);
    $q.notify({
      type: 'positive',
      message: t('auth.registerSuccess'),
      position: 'top',
    });
    authStore.setActiveTab('login');
    void router.push('/login');
  } catch (e: unknown) {
    const errorMsg = e instanceof Error && e.message ? e.message : t('auth.registerError');
    $q.notify({
      type: 'negative',
      message: errorMsg,
      position: 'top',
    });
  }
};
</script>

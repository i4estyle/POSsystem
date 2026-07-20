<template>
  <q-form class="auth-login-form" @submit.prevent="handleLogin">
    <div class="form-field">
      <label class="field-label" for="login-account">{{ $t('auth.accountLabel') }}</label>
      <q-input
        id="login-account"
        v-model="account"
        outlined
        dense
        class="custom-auth-input"
        :placeholder="$t('auth.accountPlaceholder')"
        :rules="[(val) => !!val || $t('auth.accountPlaceholder')]"
        lazy-rules
      >
        <template #prepend>
          <q-icon name="person_outline" class="input-icon" />
        </template>
      </q-input>
    </div>

    <div class="form-field">
      <div class="field-header">
        <label class="field-label" for="login-password">{{ $t('auth.passwordLabel') }}</label>
        <a href="#" class="forgot-link" @click.prevent="handleForgotPassword">
          {{ $t('auth.forgotPassword') }}
        </a>
      </div>
      <q-input
        id="login-password"
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        outlined
        dense
        class="custom-auth-input"
        :placeholder="$t('auth.passwordPlaceholder')"
        :rules="[(val) => !!val || $t('auth.passwordPlaceholder')]"
        lazy-rules
      >
        <template #prepend>
          <q-icon name="lock_outline" class="input-icon" />
        </template>
        <template #append>
          <q-icon
            :name="showPassword ? 'visibility_off' : 'visibility'"
            class="cursor-pointer input-icon"
            @click="showPassword = !showPassword"
          />
        </template>
      </q-input>
    </div>

    <q-btn type="submit" class="auth-submit-btn" :loading="authStore.isLoading" no-caps unelevated>
      <span>{{ $t('auth.submitLogin') }}</span>
    </q-btn>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';

const router = useRouter();
const $q = useQuasar();
const { t } = useI18n();
const authStore = useAuthStore();

const account = ref('');
const password = ref('');
const showPassword = ref(false);

const handleLogin = async (): Promise<void> => {
  try {
    await authStore.login({
      account: account.value,
      password: password.value,
    });
    $q.notify({
      type: 'positive',
      message: t('auth.loginSuccess'),
      position: 'top',
    });
    void router.push('/system-selection');
  } catch {
    $q.notify({
      type: 'negative',
      message: t('auth.loginError'),
      position: 'top',
    });
  }
};

const handleForgotPassword = (): void => {
  $q.notify({
    type: 'info',
    message: t('auth.forgotPassword'),
    position: 'top',
  });
};
</script>

<template>
  <section class="auth-social-section">
    <div class="divider-wrapper">
      <span class="divider-line" />
      <span class="divider-text">{{ $t('auth.orConnectWith') }}</span>
      <span class="divider-line" />
    </div>
    <div class="social-buttons-grid">
      <q-btn flat no-caps class="social-btn google-btn" @click="handleSocialLogin('Google')">
        <q-icon
          name="img:https://www.svgrepo.com/show/475656/google-color.svg"
          size="20px"
          class="q-mr-sm"
        />
        <span>{{ $t('auth.googleLogin') }}</span>
      </q-btn>

      <q-btn flat no-caps class="social-btn facebook-btn" @click="handleSocialLogin('Facebook')">
        <q-icon name="facebook" size="22px" color="primary" class="q-mr-sm" />
        <span>{{ $t('auth.facebookLogin') }}</span>
      </q-btn>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const { t } = useI18n();

const handleSocialLogin = (provider: string): void => {
  $q.notify({
    type: 'info',
    message: t('auth.socialLoginHint', { provider }),
    position: 'top',
  });
};
</script>

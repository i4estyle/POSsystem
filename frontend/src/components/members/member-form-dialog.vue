<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="app-dialog-card member-form-dialog-card">
      <AppDialogHeader
        :title="
          isEditing
            ? t('members.editMemberTitle', { name: member?.name || '' })
            : t('members.addMemberTitle')
        "
        :subtitle="t('members.memberFormSubtitle')"
        icon="card_membership"
      />

      <main class="dialog-body">
        <form class="member-form" @submit.prevent="onSave">
          <AppFormField :label="t('members.memberName')">
            <q-input
              v-model="form.name"
              outlined
              dense
              class="custom-input"
              :placeholder="t('members.memberNamePlaceholder')"
              :rules="[(val) => !!val || t('common.required')]"
            >
              <template #prepend>
                <q-icon name="person" size="18px" class="prefix-icon" />
              </template>
            </q-input>
          </AppFormField>

          <div class="form-row-2col">
            <AppFormField :label="t('auth.phoneLabel')">
              <q-input
                v-model="form.phone"
                outlined
                dense
                class="custom-input"
                placeholder="08x-xxx-xxxx"
              >
                <template #prepend>
                  <q-icon name="phone" size="18px" class="prefix-icon" />
                </template>
              </q-input>
            </AppFormField>

            <AppFormField :label="t('auth.emailLabel')">
              <q-input v-model="form.email" outlined dense class="custom-input">
                <template #prepend>
                  <q-icon name="email" size="18px" class="prefix-icon" />
                </template>
              </q-input>
            </AppFormField>
          </div>
        </form>
      </main>

      <footer class="dialog-actions">
        <button v-close-popup type="button" class="btn-cancel">
          {{ t('common.cancel') }}
        </button>

        <GradientButton
          :label="isEditing ? t('common.save') : t('common.add')"
          icon="check"
          variant="primary"
          @click="onSave"
        />
      </footer>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MemberItem } from '@/stores/member-store';
import AppDialogHeader from '@/components/base/app-dialog-header.vue';
import AppFormField from '@/components/base/app-form-field.vue';
import GradientButton from '@/components/base/gradient-button.vue';

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  member?: MemberItem | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (
    e: 'save',
    payload:
      | Omit<
          MemberItem,
          'id' | 'memberCode' | 'points' | 'tier' | 'registeredDate' | 'totalSpent' | 'status'
        >
      | Partial<MemberItem>,
  ): void;
}>();

const isEditing = computed(() => !!props.member);

const form = ref({
  name: '',
  phone: '',
  email: '',
});

watch(
  () => [props.member, props.modelValue],
  ([mb, isOpen]) => {
    if (isOpen) {
      if (mb) {
        const m = mb as MemberItem;
        form.value = {
          name: m.name,
          phone: m.phone,
          email: m.email,
        };
      } else {
        form.value = {
          name: '',
          phone: '',
          email: '',
        };
      }
    }
  },
  { immediate: true },
);

const onSave = (): void => {
  if (!form.value.name.trim()) return;
  emit('save', {
    name: form.value.name.trim(),
    phone: form.value.phone.trim(),
    email: form.value.email.trim(),
  });
  emit('update:modelValue', false);
};
</script>

<style lang="scss">
@use '../../css/variables' as *;

.member-form-dialog-card {
  width: 480px;
  max-width: 95vw;

  .member-form {
    display: flex;
    flex-direction: column;
    gap: 14px;

    .form-row-2col {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }
}
</style>

<template>
  <AppBaseDialog
    :model-value="modelValue"
    :title="t('pos.member.title')"
    icon="person_search"
    width="560px"
    max-width="95vw"
    :show-actions="false"
    class="pos-member-dialog"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="member-dialog-body">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey-7 q-mb-sm member-tabs"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="search" icon="search" :label="t('pos.member.tabSearch')" />
        <q-tab name="register" icon="person_add" :label="t('pos.member.tabRegister')" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="q-pa-none bg-transparent">
        <q-tab-panel name="search" class="q-pa-none">
          <AppFormField>
            <q-input
              v-model="searchQuery"
              outlined
              dense
              class="search-input q-mb-sm"
              :placeholder="t('pos.member.searchPlaceholder')"
              clearable
            >
              <template #prepend>
                <q-icon name="search" color="primary" />
              </template>
            </q-input>
          </AppFormField>

          <section
            v-if="filteredMembers.length === 0"
            class="empty-state text-center q-pa-xl text-grey-7"
          >
            <q-avatar size="64px" color="blue-1" text-color="secondary" class="q-mb-sm">
              <q-icon name="person_search" size="36px" />
            </q-avatar>
            <p class="text-body1 text-weight-medium q-ma-none">{{ t('pos.member.noMembers') }}</p>
          </section>

          <section v-else class="member-list">
            <article
              v-for="member in filteredMembers"
              :key="member.id"
              class="member-card-item row items-center justify-between q-pa-md q-mb-sm rounded-borders cursor-pointer"
              :class="{ 'is-selected': selectedMemberId === member.id }"
              @click="onSelectMember(member)"
            >
              <div class="member-left col row items-center q-gutter-md">
                <q-avatar
                  size="44px"
                  class="text-weight-bold member-avatar"
                  :class="getAvatarClass(member.tier)"
                >
                  {{ member.name.charAt(0) }}
                </q-avatar>
                <div class="col">
                  <div class="row items-center q-gutter-xs q-mb-xs">
                    <span class="text-weight-bold text-subtitle1 member-name">{{
                      member.name
                    }}</span>
                    <q-chip
                      dense
                      class="text-weight-bold tier-badge-chip text-white"
                      :class="getTierBadgeClass(member.tier)"
                    >
                      {{ member.tier }}
                    </q-chip>
                  </div>
                  <div class="text-caption text-grey-7 member-info">
                    <q-icon name="phone" size="14px" class="q-mr-xs" /> {{ member.phone }}
                    <span class="q-mx-xs">•</span>
                    <q-icon name="badge" size="14px" class="q-mr-xs" /> {{ member.memberCode }}
                  </div>
                </div>
              </div>

              <div class="member-right column items-end justify-center q-pl-md">
                <span class="points-text text-subtitle1 text-weight-bolder text-primary q-mb-xs">
                  {{ member.points.toLocaleString() }} {{ t('pos.member.points') }}
                </span>
                <q-btn
                  unelevated
                  rounded
                  no-caps
                  :color="selectedMemberId === member.id ? 'positive' : 'secondary'"
                  class="select-btn"
                  @click.stop="onSelectMember(member)"
                >
                  <q-icon
                    :name="selectedMemberId === member.id ? 'check_circle' : 'person_add_alt_1'"
                    size="15px"
                    class="q-mr-xs"
                  />
                  <span>
                    {{
                      selectedMemberId === member.id
                        ? t('pos.member.selected')
                        : t('pos.member.choose')
                    }}
                  </span>
                </q-btn>
              </div>
            </article>
          </section>
        </q-tab-panel>

        <q-tab-panel name="register" class="q-pa-none">
          <q-form class="q-gutter-y-md" @submit.prevent="onRegister">
            <AppFormField :label="t('pos.member.nameLabel')">
              <q-input
                v-model="form.name"
                outlined
                dense
                required
                :placeholder="t('pos.member.nameLabel')"
                class="custom-form-input"
              >
                <template #prepend>
                  <q-icon name="person" color="primary" />
                </template>
              </q-input>
            </AppFormField>

            <AppFormField :label="t('pos.member.phoneLabel')">
              <q-input
                v-model="form.phone"
                outlined
                dense
                mask="###-###-####"
                required
                :placeholder="t('pos.member.phoneLabel')"
                class="custom-form-input"
              >
                <template #prepend>
                  <q-icon name="phone" color="primary" />
                </template>
              </q-input>
            </AppFormField>

            <AppFormField :label="t('pos.member.emailLabel')">
              <q-input
                v-model="form.email"
                outlined
                dense
                type="email"
                :placeholder="t('pos.member.emailLabel')"
                class="custom-form-input"
              >
                <template #prepend>
                  <q-icon name="email" color="primary" />
                </template>
              </q-input>
            </AppFormField>

            <div class="row justify-end q-mt-lg">
              <q-btn
                type="submit"
                color="primary"
                icon="person_add"
                :label="t('pos.member.registerBtn')"
                class="full-width register-submit-btn text-weight-bold"
                size="lg"
                unelevated
              />
            </div>
          </q-form>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </AppBaseDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppBaseDialog from '@/components/base/app-base-dialog.vue';
import AppFormField from '@/components/base/app-form-field.vue';
import { useMemberStore, type MemberItem } from '@/stores/member-store';

const { t } = useI18n();
const memberStore = useMemberStore();

defineProps<{
  modelValue: boolean;
  selectedMemberId?: number | null | undefined;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'select-member', member: MemberItem): void;
}>();

const tab = ref<'search' | 'register'>('search');
const searchQuery = ref('');

const form = ref({
  name: '',
  phone: '',
  email: '',
});

const filteredMembers = computed(() => {
  if (!searchQuery.value.trim()) return memberStore.members;
  const q = searchQuery.value.toLowerCase().trim();
  return memberStore.members.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.memberCode.toLowerCase().includes(q) ||
      m.phone.includes(q),
  );
});

const getAvatarClass = (tier: string): string => {
  if (tier === 'VIP') return 'avatar-vip';
  if (tier === 'Gold') return 'avatar-gold';
  return 'avatar-silver';
};

const getTierBadgeClass = (tier: string): string => {
  if (tier === 'VIP') return 'badge-vip';
  if (tier === 'Gold') return 'badge-gold';
  return 'badge-silver';
};

const onSelectMember = (member: MemberItem): void => {
  emit('select-member', member);
  emit('update:modelValue', false);
};

const onRegister = (): void => {
  if (!form.value.name || !form.value.phone) return;
  memberStore.addMember({
    name: form.value.name,
    phone: form.value.phone,
    email: form.value.email || '',
  });
  const newMember = memberStore.members[0];
  if (newMember) {
    emit('select-member', newMember);
  }
  form.value = { name: '', phone: '', email: '' };
  tab.value = 'search';
  emit('update:modelValue', false);
};
</script>

<style lang="scss" scoped>
@use '../../css/variables' as *;

.member-dialog-body {
  font-family: $font-family-base;

  .member-tabs {
    border-bottom: 1px solid $color-border-subtle;
  }

  .search-input,
  .custom-form-input {
    :deep(.q-field__control) {
      border-radius: $radius-lg;
      background: $color-bg-surface;
      border-color: rgba(208, 195, 241, 0.6);
    }
  }

  .member-list {
    max-height: 400px;
    overflow-y: auto;
    padding-right: 8px;

    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(208, 195, 241, 0.6);
      border-radius: 10px;
    }
  }

  .member-card-item {
    background: #ffffff;
    border: 1.5px solid $color-border-subtle;
    border-radius: $radius-lg;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: $color-secondary;
      box-shadow: 0 6px 20px rgba(69, 99, 107, 0.14);
    }

    &.is-selected {
      border-color: #22c55e;
      background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
      box-shadow: 0 4px 16px rgba(34, 197, 94, 0.16);
    }

    .member-avatar {
      color: #ffffff;

      &.avatar-vip {
        background: linear-gradient(135deg, #9333ea 0%, #6b21a8 100%);
      }
      &.avatar-gold {
        background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%);
      }
      &.avatar-silver {
        background: linear-gradient(135deg, $color-secondary 0%, #2e474f 100%);
      }
    }

    .member-name {
      color: $color-text-main;
      font-family: $font-family-base;
    }

    .tier-badge-chip {
      font-size: 10.5px;
      font-weight: 800;
      padding: 2px 8px;

      &.badge-vip {
        background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
      }
      &.badge-gold {
        background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
      }
      &.badge-silver {
        background: linear-gradient(135deg, #94a3b8 0%, #475569 100%);
      }
    }

    .member-right {
      min-width: 115px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }

    .points-text {
      font-family: 'Plus Jakarta Sans', $font-family-base;
      white-space: nowrap;
    }

    .select-btn {
      font-family: $font-family-base;
      font-weight: 700;
      font-size: 12.5px;
      height: 32px;
      min-height: 32px;
      white-space: nowrap;
      padding: 0 14px;
      border-radius: $radius-full;
      box-shadow: 0 2px 8px rgba(69, 99, 107, 0.16);
      letter-spacing: 0.2px;

      :deep(.q-icon) {
        font-size: 15px !important;
      }
    }
  }

  .register-submit-btn {
    border-radius: $radius-lg;
    font-family: $font-family-base;
    height: 48px;
    box-shadow: 0 4px 14px rgba(99, 88, 128, 0.25);
  }
}
</style>

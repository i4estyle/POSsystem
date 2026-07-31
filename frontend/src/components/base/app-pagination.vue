<template>
  <div class="table-pagination-toolbar">
    <div class="pagination-info">
      {{
        t('tablePagination.showingInfo', {
          from: showingFrom,
          to: showingTo,
          total: totalRows,
        })
      }}
    </div>

    <div class="pagination-controls">
      <div v-if="showRowsPerPage && rowsPerPage !== undefined" class="rows-per-page-selector">
        <span class="selector-label">{{ t('tablePagination.rowsPerPage') }}</span>
        <button type="button" class="rows-pill-btn">
          <span>{{ rowsPerPage }}</span>
          <q-icon name="unfold_more" size="16px" class="arrow-icon" />
          <q-menu auto-close class="rows-menu-popup" anchor="bottom left" self="top left">
            <q-list style="min-width: 80px" class="rows-menu-list">
              <q-item
                v-for="opt in rowsPerPageOptions"
                :key="opt"
                clickable
                :active="rowsPerPage === opt"
                active-class="active-row-option"
                class="rows-menu-item"
                @click="emit('update:rowsPerPage', opt)"
              >
                <q-item-section class="text-center">
                  {{ opt }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </button>
      </div>

      <div class="page-nav">
        <button
          ref="prevBtnRef"
          type="button"
          class="nav-btn"
          :disabled="page <= 1"
          title="Previous Page"
          @click="onPageChange(page - 1, 'prev')"
        >
          <q-icon name="chevron_left" size="20px" />
        </button>

        <span class="page-indicator">
          {{
            t('tablePagination.pageInfo', {
              current: page,
              total: Math.max(1, maxPages),
            })
          }}
        </span>

        <button
          ref="nextBtnRef"
          type="button"
          class="nav-btn"
          :disabled="page >= maxPages"
          title="Next Page"
          @click="onPageChange(page + 1, 'next')"
        >
          <q-icon name="chevron_right" size="20px" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  page: number;
  maxPages: number;
  showingFrom: number;
  showingTo: number;
  totalRows: number;
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  showRowsPerPage?: boolean;
}

withDefaults(defineProps<Props>(), {
  rowsPerPageOptions: () => [5, 10, 20, 50],
  showRowsPerPage: true,
});

const emit = defineEmits<{
  (e: 'update:page', page: number): void;
  (e: 'update:rowsPerPage', rowsPerPage: number): void;
}>();

const { t } = useI18n();

const prevBtnRef = ref<HTMLButtonElement | null>(null);
const nextBtnRef = ref<HTMLButtonElement | null>(null);

const onPageChange = async (targetPage: number, direction: 'prev' | 'next'): Promise<void> => {
  const clickedBtn = direction === 'next' ? nextBtnRef.value : prevBtnRef.value;
  const initialTop = clickedBtn ? clickedBtn.getBoundingClientRect().top : null;

  emit('update:page', targetPage);

  await nextTick();

  requestAnimationFrame(() => {
    const targetBtn = direction === 'next' ? nextBtnRef.value : prevBtnRef.value;
    const fallbackBtn = direction === 'next' ? prevBtnRef.value : nextBtnRef.value;
    const activeBtn = targetBtn && !targetBtn.disabled ? targetBtn : fallbackBtn;

    if (activeBtn) {
      activeBtn.focus({ preventScroll: true });

      if (initialTop !== null) {
        const currentTop = activeBtn.getBoundingClientRect().top;
        const diffY = currentTop - initialTop;
        if (Math.abs(diffY) > 1) {
          window.scrollBy({ top: diffY, behavior: 'smooth' });
        }
      }
    }
  });
};
</script>

<style lang="scss">
@use '../../css/variables' as *;

.table-pagination-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
  flex-wrap: wrap;

  .pagination-info {
    font-size: 13.5px;
    font-weight: 600;
    color: $color-text-body;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 24px;

    .rows-per-page-selector {
      display: flex;
      align-items: center;
      gap: 10px;

      .selector-label {
        font-size: 13px;
        font-weight: 600;
        color: $color-text-muted;
      }

      .rows-pill-btn {
        height: 34px;
        padding: 0 12px 0 16px;
        border-radius: $radius-full;
        border: 1px solid rgba(208, 195, 241, 0.6);
        background: #ffffff;
        color: $color-primary-dark;
        font: 700 13px $font-family-base;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(99, 88, 128, 0.08);
        transition: all 0.2s ease;

        .arrow-icon {
          color: $color-primary;
          transition: transform 0.2s ease;
        }

        &:hover {
          border-color: $color-primary;
          box-shadow: 0 4px 12px rgba(99, 88, 128, 0.18);
          transform: translateY(-1px);

          .arrow-icon {
            color: $color-primary-dark;
          }
        }
      }
    }

    .page-nav {
      display: flex;
      align-items: center;
      gap: 10px;

      .page-indicator {
        font-size: 13px;
        font-weight: 700;
        color: $color-primary-dark;
        background: rgba(208, 195, 241, 0.2);
        padding: 5px 14px;
        border-radius: $radius-full;
        border: 1px solid rgba(208, 195, 241, 0.4);
      }

      .nav-btn {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 1px solid rgba(208, 195, 241, 0.6);
        background: #ffffff;
        color: $color-primary-dark;
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          background: $color-primary;
          color: #ffffff;
          border-color: $color-primary;
          box-shadow: 0 4px 10px rgba(99, 88, 128, 0.25);
          transform: scale(1.05);
        }

        &:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          border-color: rgba(208, 195, 241, 0.3);
        }
      }
    }
  }
}

.rows-menu-popup {
  border-radius: 14px !important;
  box-shadow: 0 10px 30px rgba(99, 88, 128, 0.22) !important;
  border: 1px solid rgba(208, 195, 241, 0.5) !important;
  background: #ffffff !important;
  padding: 4px !important;

  .rows-menu-list {
    padding: 0;

    .rows-menu-item {
      border-radius: 8px;
      min-height: 36px;
      font: 700 13px $font-family-base;
      color: $color-text-main;
      transition: all 0.15s ease;

      &:hover {
        background: rgba(208, 195, 241, 0.2);
        color: $color-primary-dark;
      }

      &.active-row-option {
        background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
        color: #ffffff !important;
        box-shadow: 0 4px 12px rgba(99, 88, 128, 0.3);
      }
    }
  }
}
</style>

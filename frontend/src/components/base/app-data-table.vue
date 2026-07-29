<template>
  <div class="app-data-table-wrapper">
    <q-table
      v-model:pagination="pagination"
      :rows="rows"
      :columns="columns"
      :row-key="rowKey"
      :loading="loading"
      flat
      class="app-data-table"
    >
      <!-- Forward body cell slots -->
      <template v-for="col in columns" :key="`body-${col.name}`" #[`body-cell-${col.name}`]="props">
        <q-td :props="props" :class="`text-${col.align || 'left'}`">
          <slot :name="`body-cell-${col.name}`" v-bind="props">
            {{ props.value }}
          </slot>
        </q-td>
      </template>

      <!-- Custom Bottom Pagination Toolbar -->
      <template #bottom>
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
            <div class="rows-per-page-selector">
              <span class="selector-label">{{ t('tablePagination.rowsPerPage') }}</span>
              <button type="button" class="rows-pill-btn">
                <span>{{ pagination.rowsPerPage }}</span>
                <q-icon name="unfold_more" size="16px" class="arrow-icon" />
                <q-menu auto-close class="rows-menu-popup" anchor="bottom left" self="top left">
                  <q-list style="min-width: 80px" class="rows-menu-list">
                    <q-item
                      v-for="opt in rowsPerPageOptions"
                      :key="opt"
                      clickable
                      :active="pagination.rowsPerPage === opt"
                      active-class="active-row-option"
                      class="rows-menu-item"
                      @click="pagination.rowsPerPage = opt"
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
                type="button"
                class="nav-btn"
                :disabled="isFirstPage"
                title="Previous Page"
                @click="prevPage"
              >
                <q-icon name="chevron_left" size="20px" />
              </button>

              <span class="page-indicator">
                {{
                  t('tablePagination.pageInfo', {
                    current: pagination.page,
                    total: maxPages,
                  })
                }}
              </span>

              <button
                type="button"
                class="nav-btn"
                :disabled="isLastPage"
                title="Next Page"
                @click="nextPage"
              >
                <q-icon name="chevron_right" size="20px" />
              </button>
            </div>
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { QTableColumn } from 'quasar';

interface Props {
  rows: T[];
  columns: QTableColumn<T>[];
  rowKey: string;
  tableId?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const { t } = useI18n();
const route = useRoute();

const rowsPerPageOptions = [5, 10, 20, 50];

const storageKey = computed(() => {
  const path = route?.path || '';
  return `pos_table_state_${props.tableId || path || props.rowKey}`;
});

interface SavedTableState {
  sortBy?: string | null;
  descending?: boolean;
  page?: number;
  rowsPerPage?: number;
}

const getInitialPagination = () => {
  const path = route?.path || '';
  const key = `pos_table_state_${props.tableId || path || props.rowKey}`;
  try {
    const saved = sessionStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved) as SavedTableState;
      return {
        sortBy: typeof parsed.sortBy === 'string' ? parsed.sortBy : null,
        descending: Boolean(parsed.descending),
        page: typeof parsed.page === 'number' && parsed.page > 0 ? parsed.page : 1,
        rowsPerPage:
          typeof parsed.rowsPerPage === 'number' && parsed.rowsPerPage > 0
            ? parsed.rowsPerPage
            : 10,
      };
    }
  } catch {
    // Ignore storage parse error
  }
  return {
    sortBy: null,
    descending: false,
    page: 1,
    rowsPerPage: 10,
  };
};

const pagination = ref(getInitialPagination());

const totalRows = computed(() => props.rows.length);

const maxPages = computed(() => {
  const rpp = pagination.value.rowsPerPage;
  if (rpp <= 0 || totalRows.value === 0) return 1;
  return Math.ceil(totalRows.value / rpp);
});

const showingFrom = computed(() => {
  if (totalRows.value === 0) return 0;
  return (pagination.value.page - 1) * pagination.value.rowsPerPage + 1;
});

const showingTo = computed(() => {
  if (totalRows.value === 0) return 0;
  return Math.min(pagination.value.page * pagination.value.rowsPerPage, totalRows.value);
});

const isFirstPage = computed(() => pagination.value.page <= 1);
const isLastPage = computed(() => pagination.value.page >= maxPages.value);

const prevPage = (): void => {
  if (!isFirstPage.value) {
    pagination.value.page -= 1;
  }
};

const nextPage = (): void => {
  if (!isLastPage.value) {
    pagination.value.page += 1;
  }
};

// Reset page if rows per page changes or items filtered out
watch(
  () => [pagination.value.rowsPerPage, totalRows.value],
  () => {
    if (pagination.value.page > maxPages.value) {
      pagination.value.page = Math.max(1, maxPages.value);
    }
  },
);

// Save table session state (sort & pagination) to sessionStorage
watch(
  () => [
    pagination.value.sortBy,
    pagination.value.descending,
    pagination.value.page,
    pagination.value.rowsPerPage,
  ],
  ([sortBy, descending, page, rowsPerPage]) => {
    try {
      sessionStorage.setItem(
        storageKey.value,
        JSON.stringify({ sortBy, descending, page, rowsPerPage }),
      );
    } catch {
      // Ignore storage write error
    }
  },
  { deep: true },
);
</script>

<style lang="scss">
@use '../../css/variables' as *;

.app-data-table-wrapper {
  width: 100%;
  border-radius: $radius-xl;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(99, 88, 128, 0.06);
  background: #ffffff;
  border: 1px solid rgba(208, 195, 241, 0.4);

  .app-data-table {
    font-family: $font-family-base;
    background: transparent;

    thead tr {
      background: linear-gradient(
        180deg,
        rgba(244, 239, 255, 0.9) 0%,
        rgba(253, 248, 252, 0.7) 100%
      );
      height: 52px;

      th {
        font-weight: 700;
        font-size: 13px;
        color: $color-primary-dark;
        letter-spacing: 0.02em;
        border-bottom: 2px solid rgba(208, 195, 241, 0.5);
        padding: 14px 24px;
        white-space: nowrap;
        vertical-align: middle;
        user-select: none;

        .q-table__sort-icon {
          font-size: 18px;
          color: $color-primary;
          margin-left: 4px;
          transition:
            transform 0.25s ease,
            opacity 0.2s ease;
        }

        &.text-left {
          text-align: left !important;
        }

        &.text-center {
          text-align: center !important;
        }

        &.text-right {
          text-align: right !important;
        }

        &.sortable {
          cursor: pointer;

          &:hover {
            color: $color-primary;
            background: rgba(208, 195, 241, 0.25);
          }
        }

        &.sorted {
          color: $color-primary-dark;
          font-weight: 800;

          .q-table__sort-icon {
            opacity: 1;
          }
        }
      }
    }

    tbody tr {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

      td {
        padding: 16px 24px;
        font-size: 14px;
        font-weight: 600;
        color: $color-text-main;
        border-bottom: 1px solid rgba(238, 233, 237, 0.7);
        vertical-align: middle;

        &.text-left {
          text-align: left !important;
        }

        &.text-center {
          text-align: center !important;
        }

        &.text-right {
          text-align: right !important;
        }
      }

      &:last-child td {
        border-bottom: 1px solid rgba(238, 233, 237, 0.7);
      }

      &:hover {
        background: rgba(208, 195, 241, 0.15) !important;

        td {
          color: $color-primary-dark;
        }
      }
    }

    .q-table__bottom {
      border-top: 1px solid rgba(208, 195, 241, 0.4);
      background: linear-gradient(180deg, #ffffff 0%, rgba(253, 248, 252, 0.5) 100%);
      padding: 12px 24px;

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
    }
  }
}

/* Global Rows Menu Popup Style */
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

<template>
  <div class="app-data-table-wrapper">
    <q-table
      :rows="rows"
      :columns="columns"
      :row-key="rowKey"
      :loading="loading"
      flat
      hide-bottom
      :pagination="defaultPagination"
      class="app-data-table"
    >
      <!-- Forward header cell slots -->
      <template
        v-for="col in columns"
        :key="`header-${col.name}`"
        #[`header-cell-${col.name}`]="props"
      >
        <q-th :props="props" :class="`text-${col.align || 'left'}`">
          <slot :name="`header-cell-${col.name}`" v-bind="props">
            <span class="header-label">{{ props.col.label }}</span>
          </slot>
        </q-th>
      </template>

      <!-- Forward body cell slots -->
      <template v-for="col in columns" :key="`body-${col.name}`" #[`body-cell-${col.name}`]="props">
        <q-td :props="props" :class="`text-${col.align || 'left'}`">
          <slot :name="`body-cell-${col.name}`" v-bind="props">
            {{ props.value }}
          </slot>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { QTableColumn } from 'quasar';

interface Props {
  rows: T[];
  columns: QTableColumn<T>[];
  rowKey: string;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
});

const defaultPagination = {
  rowsPerPage: 0,
};
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
        position: relative;
        font-weight: 700;
        font-size: 13px;
        color: $color-primary-dark;
        letter-spacing: 0.02em;
        border-bottom: 2px solid rgba(208, 195, 241, 0.5);
        padding: 14px 24px;
        white-space: nowrap;
        vertical-align: middle;

        .header-label {
          display: inline-block;
          vertical-align: middle;
        }

        .q-table__sort-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          margin-top: -8px;
          font-size: 16px;
          color: $color-primary;
          opacity: 0;
          visibility: hidden;
          transition:
            opacity 0.2s ease,
            visibility 0.2s ease,
            transform 0.25s ease;
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

            .q-table__sort-icon {
              opacity: 0.85;
              visibility: visible;
            }
          }
        }

        &.sorted .q-table__sort-icon {
          color: $color-primary-dark;
          opacity: 1;
          visibility: visible;
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
        border-bottom: none;
      }

      &:hover {
        background: rgba(208, 195, 241, 0.15) !important;

        td {
          color: $color-primary-dark;
        }
      }
    }
  }
}
</style>

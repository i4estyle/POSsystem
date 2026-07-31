<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="app-dialog-card table-qr-dialog-card">
      <AppDialogHeader
        :title="t('tables.qrDialog.title', { table: table?.tableNumber || '' })"
        :subtitle="t('tables.qrDialog.scanToOrder', { table: table?.tableNumber || '' })"
        icon="qr_code_2"
      />

      <main class="dialog-body qr-dialog-body">
        <section class="qr-code-wrapper">
          <canvas ref="qrCanvasRef" class="qr-canvas"></canvas>
          <span class="table-tag-badge">
            {{ t('tables.card.tableLabel') }} {{ table?.tableNumber }}
          </span>
        </section>

        <p class="qr-url-text">{{ qrTargetUrl }}</p>
      </main>

      <footer class="dialog-actions centered-actions">
        <button type="button" class="btn-cancel" @click="onPrint">
          <q-icon name="print" size="18px" />
          <span>{{ t('tables.qrDialog.print') }}</span>
        </button>

        <GradientButton
          :label="t('tables.qrDialog.download')"
          icon="download"
          variant="primary"
          @click="onDownload"
        />
      </footer>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import QRCode from 'qrcode';
import type { TableManagementItem } from '@/types/dining-table';
import AppDialogHeader from '@/components/base/app-dialog-header.vue';
import GradientButton from '@/components/base/gradient-button.vue';

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  table: TableManagementItem | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const qrCanvasRef = ref<HTMLCanvasElement | null>(null);

const qrTargetUrl = computed(() => {
  if (!props.table) return '';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pos.system';
  return `${origin}/order?tableId=${props.table.tableId}&tableNumber=${encodeURIComponent(props.table.tableNumber)}`;
});

const generateQr = async (): Promise<void> => {
  await nextTick();
  if (!qrCanvasRef.value || !qrTargetUrl.value) return;

  try {
    await QRCode.toCanvas(qrCanvasRef.value, qrTargetUrl.value, {
      width: 220,
      margin: 2,
      color: {
        dark: '#3b2c60',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('QR generation failed:', err);
  }
};

watch(
  () => [props.modelValue, props.table],
  ([isOpen]) => {
    if (isOpen) {
      void generateQr();
    }
  },
);

const onDownload = (): void => {
  if (!qrCanvasRef.value || !props.table) return;
  const link = document.createElement('a');
  link.download = `QR-${props.table.tableNumber}.png`;
  link.href = qrCanvasRef.value.toDataURL('image/png');
  link.click();
};

const onPrint = (): void => {
  if (!qrCanvasRef.value || !props.table) return;
  const dataUrl = qrCanvasRef.value.toDataURL('image/png');
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    `  <title>Print QR Code - ${props.table.tableNumber}</title>`,
    '  <style>',
    '    body { font-family: Sarabun, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }',
    '    .table-title { font-size: 24px; font-weight: bold; margin-bottom: 12px; color: #1c1b1e; }',
    '    img { width: 260px; height: 260px; }',
    '    .instruction { margin-top: 12px; font-size: 14px; color: #79757e; }',
    '  </style>',
    '</head>',
    '<body>',
    `  <div class="table-title">โต๊ะ ${props.table.tableNumber}</div>`,
    `  <img src="${dataUrl}" />`,
    '  <div class="instruction">สแกนเพื่อสั่งอาหาร</div>',
    '  <' + 'script' + '>',
    '    window.onload = function() { window.print(); window.close(); };',
    '  <' + '/script' + '>',
    '<' + '/body' + '>',
    '<' + '/html' + '>',
  ].join('\n');

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
</script>

<style lang="scss">
@use '../../css/variables' as *;

.table-qr-dialog-card {
  width: 420px;
  max-width: 95vw;

  .qr-dialog-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    .qr-code-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      background: #ffffff;
      border-radius: $radius-xl;
      border: 1px solid rgba(208, 195, 241, 0.4);
      box-shadow: 0 8px 24px rgba(99, 88, 128, 0.08);

      .table-tag-badge {
        margin-top: 10px;
        padding: 4px 14px;
        border-radius: $radius-full;
        background: rgba(208, 195, 241, 0.25);
        color: $color-primary-dark;
        font: 700 12.5px $font-family-base;
      }
    }

    .qr-url-text {
      margin: 0;
      font: 600 11.5px $font-family-base;
      color: $color-text-muted;
      word-break: break-all;
      text-align: center;
    }
  }
}
</style>

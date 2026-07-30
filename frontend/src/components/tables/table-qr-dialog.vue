<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="table-qr-card">
      <header class="qr-dialog-header">
        <div>
          <h2 class="dialog-title">
            {{ t('tables.qrDialog.title', { table: table?.tableNumber || '' }) }}
          </h2>
          <small class="dialog-subtitle">
            {{ t('tables.qrDialog.scanToOrder', { table: table?.tableNumber || '' }) }}
          </small>
        </div>
        <q-btn v-close-popup flat round icon="close" size="md" class="close-btn" />
      </header>

      <main class="qr-dialog-body">
        <section class="qr-code-wrapper">
          <canvas ref="qrCanvasRef" class="qr-canvas"></canvas>
          <span class="table-tag-badge">
            {{ t('tables.card.tableLabel') }} {{ table?.tableNumber }}
          </span>
        </section>

        <p class="qr-url-text">{{ qrTargetUrl }}</p>
      </main>

      <footer class="qr-dialog-actions">
        <button type="button" class="action-btn print-btn" @click="onPrint">
          <q-icon name="print" size="18px" />
          <span>{{ t('tables.qrDialog.print') }}</span>
        </button>

        <button type="button" class="action-btn download-btn" @click="onDownload">
          <q-icon name="download" size="18px" />
          <span>{{ t('tables.qrDialog.download') }}</span>
        </button>
      </footer>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import QRCode from 'qrcode';
import type { TableManagementItem } from '@/types/dining-table';

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

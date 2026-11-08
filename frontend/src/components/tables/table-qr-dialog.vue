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

        <div class="qr-host-config-box">
          <label class="qr-host-label">
            <q-icon :name="isCloudflareActive ? 'cloud_done' : 'wifi'" size="16px" />
            <span>
              {{
                isCloudflareActive
                  ? '✅ ลิงก์ออนไลน์พร้อมสแกน (ใช้ได้ทั้งเน็ตมือถือ 4G/5G และ Wi-Fi ร้าน)'
                  : 'URL สำหรับสแกนด้วยมือถือ'
              }}
            </span>
          </label>
          <input
            v-model="customOrigin"
            type="text"
            class="qr-host-input"
            placeholder="เช่น https://xxxx.trycloudflare.com"
          />
          <small class="qr-host-hint">
            {{
              isCloudflareActive
                ? 'ซิงก์ลิงก์ HTTPS สาธารณะให้อัตโนมัติแล้ว ลูกค้าสแกนสั่งเข้าครัวได้ทันทีโดยไม่ต้องต่อ Wi-Fi'
                : 'ระบบกำลังซิงก์ลิงก์ออนไลน์อัตโนมัติ หรือวางลิงก์ https://...trycloudflare.com ที่นี่'
            }}
          </small>
        </div>

        <p class="qr-url-text">{{ qrTargetUrl }}</p>

        <button type="button" class="qr-open-preview-btn" @click="onOpenMobileOrder">
          <q-icon name="smartphone" size="18px" />
          <span>เปิดหน้าสั่งอาหารมือถือ (ทดลองสแกนโต๊ะ {{ table?.tableNumber }})</span>
        </button>
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
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import QRCode from 'qrcode';
import type { TableManagementItem } from '@/types/dining-table';
import AppDialogHeader from '@/components/base/app-dialog-header.vue';
import GradientButton from '@/components/base/gradient-button.vue';

const { t } = useI18n();
const router = useRouter();

const props = defineProps<{
  modelValue: boolean;
  table: TableManagementItem | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const qrCanvasRef = ref<HTMLCanvasElement | null>(null);
const customOrigin = ref<string>('http://localhost:9000');
const backendTunnelUrl = ref<string>('');

const isCloudflareActive = computed(() => customOrigin.value.includes('.trycloudflare.com'));

const fetchAutoTunnelUrl = async (): Promise<void> => {
  try {
    const res = await fetch(`/tunnel-url.json?t=${Date.now()}`);
    if (res.ok) {
      const data = (await res.json()) as {
        url?: string;
        frontendUrl?: string;
        backendUrl?: string;
      };
      const front = data.frontendUrl || data.url;
      if (front && front.startsWith('https://')) {
        customOrigin.value = front;
      }
      if (data.backendUrl && data.backendUrl.startsWith('https://')) {
        backendTunnelUrl.value = data.backendUrl;
      }
      if (front) return;
    }
  } catch {
    // fallback to backend endpoint
  }

  try {
    const res2 = await fetch('http://localhost:3000/qr-orders/tunnel-info');
    if (res2.ok) {
      const data2 = (await res2.json()) as {
        frontendUrl?: string | null;
        backendUrl?: string | null;
      };
      if (data2.frontendUrl) {
        customOrigin.value = data2.frontendUrl;
      }
      if (data2.backendUrl) {
        backendTunnelUrl.value = data2.backendUrl;
      }
    }
  } catch {
    // ignore
  }
};

onMounted(() => {
  void fetchAutoTunnelUrl();
});

const qrTargetUrl = computed(() => {
  if (!props.table) return '';
  const cleanOrigin = (customOrigin.value || 'http://localhost:9000').replace(/\/+$/, '');
  return `${cleanOrigin}/order?tableId=${props.table.tableId}&tableNumber=${encodeURIComponent(props.table.tableNumber)}`;
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
  () => [props.modelValue, props.table, customOrigin.value, backendTunnelUrl.value],
  async ([isOpen]) => {
    if (isOpen) {
      await fetchAutoTunnelUrl();
      await generateQr();
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

const onOpenMobileOrder = (): void => {
  if (!props.table) return;
  emit('update:modelValue', false);
  void router.push({
    path: '/order',
    query: {
      tableId: String(props.table.tableId),
      tableNumber: props.table.tableNumber,
    },
  });
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
  width: 440px;
  max-width: 95vw;

  .qr-dialog-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;

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

    .qr-host-config-box {
      width: 100%;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 5px;

      .qr-host-label {
        display: flex;
        align-items: center;
        gap: 5px;
        font: 700 11.5px $font-family-base;
        color: #166534;
      }

      .qr-host-input {
        width: 100%;
        border: 1px solid #86efac;
        border-radius: 8px;
        padding: 6px 10px;
        font: 600 12.5px $font-family-base;
        color: $color-text-main;
        background: #ffffff;
        outline: none;

        &:focus {
          border-color: #16a34a;
        }
      }

      .qr-host-hint {
        font: 500 10.5px $font-family-base;
        color: #15803d;
      }
    }

    .qr-url-text {
      margin: 0;
      font: 600 11.5px $font-family-base;
      color: $color-text-muted;
      word-break: break-all;
      text-align: center;
    }

    .qr-open-preview-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      padding: 10px 14px;
      border-radius: 12px;
      border: 1.5px dashed rgba(99, 88, 128, 0.45);
      background: #f8f5fc;
      color: $color-primary-dark;
      font: 700 13px $font-family-base;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: $palette-purple;
        border-color: $color-primary;
      }
    }
  }
}
</style>

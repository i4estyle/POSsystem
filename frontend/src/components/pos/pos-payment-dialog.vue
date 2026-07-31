<template>
  <AppBaseDialog
    :model-value="modelValue"
    :title="currentStep === 'payment' ? t('pos.payment.title') : 'ใบเสร็จรับเงิน (Receipt)'"
    :icon="currentStep === 'payment' ? 'payments' : 'receipt_long'"
    width="560px"
    max-width="95vw"
    :show-actions="false"
    class="pos-payment-dialog"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="payment-dialog-body">
      <transition name="dialog-step-fade" mode="out-in">
        <!-- STEP 1: PAYMENT CHECKOUT VIEW -->
        <div v-if="currentStep === 'payment'" key="step-payment" class="step-container">
          <!-- Total Payable Banner -->
          <header class="payment-total-banner q-py-sm q-px-md text-center q-mb-md">
            <span class="banner-sublabel text-caption text-uppercase text-weight-bold block">
              {{ t('pos.payment.totalPayable') }}
            </span>
            <span class="banner-amount text-h4 text-weight-bolder block">
              ฿{{
                totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </span>
          </header>

          <!-- Payment Method Selector -->
          <section class="payment-method-selector row q-col-gutter-sm q-mb-md">
            <div v-for="method in methods" :key="method.value" class="col-3">
              <button
                type="button"
                class="payment-method-btn column items-center justify-center full-width q-py-xs q-px-xs"
                :class="[
                  { 'is-active': selectedMethod === method.value },
                  `method-${method.value.toLowerCase()}`,
                ]"
                @click="selectedMethod = method.value"
              >
                <div class="method-icon-stage q-mb-xs">
                  <q-icon :name="method.icon" size="18px" />
                </div>
                <span class="method-label text-caption text-weight-bold">{{ method.label }}</span>
              </button>
            </div>
          </section>

          <!-- Fixed Height Stage (Freeze Layout Bounds with Smooth Transition) -->
          <main class="payment-method-stage q-mb-md">
            <transition name="method-slide" mode="out-in">
              <!-- CASH PAYMENT PANEL -->
              <section
                v-if="selectedMethod === PaymentMethod.CASH"
                key="cash"
                class="method-panel-content cash-payment-section column justify-between"
              >
                <div class="cash-display-grid row q-col-gutter-xs q-mb-xs">
                  <div class="col-6">
                    <div
                      class="amount-box tendered-box q-py-xs q-px-sm rounded-borders text-center"
                    >
                      <span class="box-label text-caption text-grey-8 block">{{
                        t('pos.payment.tendered')
                      }}</span>
                      <span class="box-val text-subtitle1 text-weight-bold block">
                        ฿{{
                          (Number(tenderedString) || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })
                        }}
                      </span>
                    </div>
                  </div>
                  <div class="col-6">
                    <div
                      class="amount-box change-box q-py-xs q-px-sm rounded-borders text-center"
                      :class="
                        calculatedChange >= 0 && Number(tenderedString) >= totalAmount
                          ? 'is-sufficient'
                          : 'is-deficit'
                      "
                    >
                      <span class="box-label text-caption block">{{
                        t('pos.payment.change')
                      }}</span>
                      <span class="box-val text-subtitle1 text-weight-bold block">
                        ฿{{
                          calculatedChange.toLocaleString(undefined, { minimumFractionDigits: 2 })
                        }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Presets -->
                <div class="preset-amounts row q-col-gutter-xs q-mb-xs">
                  <div v-for="preset in cashPresets" :key="preset.label" class="col">
                    <q-btn
                      outline
                      dense
                      class="full-width preset-btn text-weight-bold"
                      :label="preset.label"
                      @click="applyPreset(preset.value)"
                    />
                  </div>
                </div>

                <!-- Numeric Keypad Grid (3x4 = 12 buttons) -->
                <div class="numeric-keypad grid-keypad q-mb-xs">
                  <button
                    v-for="key in keypadKeys"
                    :key="key"
                    type="button"
                    class="key-btn"
                    @click="pressKey(key)"
                  >
                    {{ key }}
                  </button>
                </div>

                <!-- Clear & Delete Action Row (50% / 50% split) -->
                <div class="keypad-actions-row row q-col-gutter-xs">
                  <div class="col-6">
                    <button
                      type="button"
                      class="key-btn key-btn--danger full-width text-center"
                      @click="clearKeypad"
                    >
                      <span class="text-weight-bold">ล้าง</span>
                    </button>
                  </div>
                  <div class="col-6">
                    <button
                      type="button"
                      class="key-btn key-btn--warning full-width text-center"
                      @click="backspaceKeypad"
                    >
                      <span class="text-weight-bold">ลบ</span>
                    </button>
                  </div>
                </div>

                <!-- Cash Drawer Banner -->
                <div
                  v-if="showDrawerAnimation"
                  class="cash-drawer-banner row items-center justify-center q-py-xs q-px-sm rounded-borders text-caption q-mt-xs"
                >
                  <q-icon name="door_sliding" size="18px" class="q-mr-xs animate-bounce" />
                  <span class="text-weight-bold">{{ t('pos.payment.drawerOpened') }}</span>
                </div>
              </section>

              <!-- SCAN QR PANEL -->
              <section
                v-else-if="selectedMethod === PaymentMethod.QR"
                key="qr"
                class="method-panel-content non-cash-payment-section column items-center justify-center text-center"
              >
                <div
                  class="qr-frame q-pa-sm bg-white rounded-borders shadow-2 inline-block q-mb-sm"
                >
                  <q-icon name="qr_code_2" size="135px" color="teal-8" />
                </div>
                <p class="text-body2 text-weight-medium text-grey-8 q-ma-none font-sarabun">
                  {{ t('pos.payment.scanQrNote') }}
                </p>
              </section>

              <!-- CREDIT CARD PANEL -->
              <section
                v-else-if="selectedMethod === PaymentMethod.CREDIT_CARD"
                key="credit"
                class="method-panel-content non-cash-payment-section column items-center justify-center text-center"
              >
                <q-avatar
                  size="84px"
                  color="indigo-1"
                  text-color="indigo-7"
                  class="q-mb-sm animate-pulse"
                >
                  <q-icon name="credit_card" size="46px" />
                </q-avatar>
                <p class="text-subtitle1 text-weight-bold text-dark q-mb-xs font-sarabun">
                  {{ t('pos.payment.insertCardNote') }}
                </p>
                <span class="text-caption text-grey-6 font-sarabun">{{
                  t('pos.payment.waitingTerminal')
                }}</span>
              </section>

              <!-- TRUE WALLET PANEL -->
              <section
                v-else-if="selectedMethod === PaymentMethod.TRUE_WALLET"
                key="wallet"
                class="method-panel-content non-cash-payment-section column items-center justify-center text-center"
              >
                <q-avatar size="84px" color="orange-1" text-color="deep-orange-7" class="q-mb-sm">
                  <q-icon name="account_balance_wallet" size="46px" />
                </q-avatar>
                <p class="text-subtitle1 text-weight-bold text-dark q-ma-none font-sarabun">
                  {{ t('pos.payment.trueWalletNote') }}
                </p>
              </section>
            </transition>
          </main>

          <!-- UNIFIED GREEN CONFIRM BUTTON -->
          <button
            type="button"
            class="submit-pay-btn full-width row items-center justify-center"
            :disabled="
              selectedMethod === PaymentMethod.CASH &&
              (Number(tenderedString) < totalAmount || isProcessing)
            "
            @click="processPayment"
          >
            <span class="btn-icon-circle q-mr-xs">
              <q-icon name="check_circle" size="16px" />
            </span>
            <span class="btn-text text-weight-bold">
              {{ t('pos.payment.confirmNonCash') }}
            </span>
          </button>
        </div>

        <!-- STEP 2: FORMAL OFFICIAL POS THERMAL RECEIPT VIEW (Branch dynamically bound to active employee session) -->
        <div
          v-else
          key="step-receipt"
          class="step-container receipt-step-container column items-center"
        >
          <div
            class="thermal-receipt-paper full-width q-px-md q-py-sm shadow-1 rounded-borders font-monospace"
          >
            <!-- SHOP BRANDING & HEADER (Dynamic branch from employee session) -->
            <div class="receipt-header text-center">
              <div class="receipt-header-icon q-mx-auto q-mb-xs">
                <q-icon name="storefront" size="20px" color="dark" />
              </div>
              <div class="shop-name text-uppercase font-monospace">i4estyle POS Shop</div>
              <div class="font-monospace">{{ activeReceipt.branchName }}</div>
              <div class="font-monospace">Tax ID: 0105563999999 (VAT Included)</div>

              <div class="receipt-dashed-line q-my-xs"></div>

              <div class="row justify-between font-monospace">
                <span>ใบเสร็จ #: {{ receiptNumber }}</span>
                <span>{{ receiptDate }}</span>
              </div>
              <div class="row justify-between font-monospace">
                <span>แคชเชียร์: {{ activeReceipt.cashierName }}</span>
                <span>เครื่อง POS #01</span>
              </div>
              <div class="row justify-between font-monospace">
                <span
                  >ประเภท:
                  {{
                    activeReceipt.orderType === OrderType.TAKEAWAY ? 'กลับบ้าน' : 'ทานที่ร้าน'
                  }}</span
                >
                <span v-if="activeReceipt.tableName">โต๊ะ: {{ activeReceipt.tableName }}</span>
              </div>
            </div>

            <!-- MEMBER INFORMATION (Formal monochrome, no duplicate คุณ) -->
            <div
              v-if="activeReceipt.member"
              class="receipt-member-box q-pa-xs q-my-xs rounded-borders font-monospace"
            >
              <div class="row items-center justify-between font-monospace">
                <span>สมาชิก: {{ formatMemberName(activeReceipt.member.name) }}</span>
                <span>({{ activeReceipt.member.phone || activeReceipt.member.memberCode }})</span>
              </div>
              <div class="row items-center justify-between font-monospace">
                <span>แต้มสะสมปัจจุบัน: {{ activeReceipt.member.points || 0 }} แต้ม</span>
                <span>+{{ earnedPoints }} แต้ม (ได้รับ)</span>
              </div>
            </div>

            <div class="receipt-dashed-line q-my-xs"></div>

            <!-- PRODUCT ITEM TABLE -->
            <div class="receipt-table-wrapper q-my-xs">
              <table class="receipt-table full-width font-monospace">
                <thead>
                  <tr class="border-bottom">
                    <th class="col-name text-left">รายการสินค้า</th>
                    <th class="col-qty text-center">จำนวน</th>
                    <th class="col-price text-right">ราคา</th>
                    <th class="col-total text-right">รวม (฿)</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="activeReceipt.items && activeReceipt.items.length > 0">
                    <tr v-for="(item, idx) in activeReceipt.items" :key="idx">
                      <td class="col-name text-left item-name">{{ item.product.productName }}</td>
                      <td class="col-qty text-center">x{{ item.quantity }}</td>
                      <td class="col-price text-right">
                        {{ item.product.sellingPrice.toFixed(2) }}
                      </td>
                      <td class="col-total text-right">
                        {{ (item.product.sellingPrice * item.quantity).toFixed(2) }}
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td class="col-name text-left item-name">รายการสินค้าทั่วไป</td>
                      <td class="col-qty text-center">x1</td>
                      <td class="col-price text-right">
                        {{ activeReceipt.totalAmount.toFixed(2) }}
                      </td>
                      <td class="col-total text-right">
                        {{ activeReceipt.totalAmount.toFixed(2) }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>

            <div class="receipt-dashed-line q-my-xs"></div>

            <!-- FINANCIAL TOTALS -->
            <div class="receipt-totals font-monospace">
              <div class="row justify-between q-py-xxs">
                <span>ราคารวมสินค้า (Subtotal):</span>
                <span>฿{{ activeReceipt.subtotal.toFixed(2) }}</span>
              </div>

              <div
                v-if="activeReceipt.promotion || activeReceipt.discountAmount > 0"
                class="row justify-between q-py-xxs"
              >
                <span
                  >ส่วนลดโปรโมชั่น ({{ activeReceipt.promotion?.title || 'ส่วนลดพิเศษ' }}):</span
                >
                <span>-฿{{ activeReceipt.discountAmount.toFixed(2) }}</span>
              </div>

              <div class="row justify-between q-py-xxs">
                <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
                <span>฿{{ activeReceipt.tax.toFixed(2) }}</span>
              </div>

              <div class="receipt-solid-line q-my-xs"></div>

              <div class="row justify-between q-py-xs">
                <span>ยอดเงินสุทธิ (Net Total):</span>
                <span>฿{{ activeReceipt.totalAmount.toFixed(2) }}</span>
              </div>
            </div>

            <div class="receipt-dashed-line q-my-xs"></div>

            <!-- PAYMENT METHOD DETAILS -->
            <div class="receipt-payment-info font-monospace">
              <div class="row justify-between">
                <span>วิธีชำระเงิน:</span>
                <span class="text-uppercase">{{ getMethodLabel(selectedMethod) }}</span>
              </div>
              <template v-if="selectedMethod === PaymentMethod.CASH">
                <div class="row justify-between">
                  <span>รับเงินสด (Tendered):</span>
                  <span
                    >฿{{ (Number(tenderedString) || activeReceipt.totalAmount).toFixed(2) }}</span
                  >
                </div>
                <div class="row justify-between">
                  <span>เงินทอน (Change):</span>
                  <span>฿{{ calculatedChange.toFixed(2) }}</span>
                </div>
              </template>
              <template v-else>
                <div class="row justify-between">
                  <span>Ref No:</span>
                  <span>TXN-{{ Math.floor(100000 + Math.random() * 900000) }}</span>
                </div>
                <div class="row justify-between">
                  <span>สถานะ:</span>
                  <span>ชำระอนุมัติเรียบร้อย (SUCCESS)</span>
                </div>
              </template>
            </div>

            <div class="receipt-dashed-line q-my-xs"></div>

            <!-- RECEIPT FOOTER BARCODE -->
            <div class="receipt-footer text-center q-pt-xs font-monospace">
              <div class="barcode-wrapper q-mb-xs">
                <div class="barcode-lines row justify-center items-center gap-xxs">
                  <span
                    v-for="n in 26"
                    :key="n"
                    class="bar-line"
                    :style="{ width: n % 3 === 0 ? '2.5px' : '1px' }"
                  ></span>
                </div>
                <span class="block q-mt-xxs">TRX-{{ receiptNumber }}</span>
              </div>
              <p class="q-ma-none">*** ขอบคุณที่ใช้บริการ / THANK YOU ***</p>
              <span class="block">โปรดเก็บใบเสร็จไว้เพื่อเป็นหลักฐาน</span>
            </div>
          </div>

          <!-- RECEIPT ACTION BUTTONS -->
          <div class="receipt-actions row q-col-gutter-sm full-width q-mt-sm">
            <div class="col-6">
              <button
                type="button"
                class="btn-receipt-action btn-print full-width row items-center justify-center rounded-borders"
                @click="printReceipt"
              >
                <q-icon name="print" size="18px" class="q-mr-xs" />
                <span class="text-weight-bold">พิมพ์ใบเสร็จ</span>
              </button>
            </div>
            <div class="col-6">
              <button
                type="button"
                class="btn-receipt-action btn-finish full-width row items-center justify-center rounded-borders"
                @click="onFinish"
              >
                <q-icon name="check_circle" size="18px" class="q-mr-xs" />
                <span class="text-weight-bold">เสร็จสิ้น / ออเดอร์ใหม่</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </AppBaseDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import AppBaseDialog from '@/components/base/app-base-dialog.vue';
import { PaymentMethod, OrderType, type CartItemInterface } from '@/types/order';
import type { TableManagementItem } from '@/types/dining-table';
import type { PromotionItem } from '@/stores/promotion-store';
import type { MemberItem } from '@/stores/member-store';

const { t } = useI18n();
const $q = useQuasar();

interface ReceiptSnapshotData {
  totalAmount: number;
  subtotal: number;
  discountAmount: number;
  tax: number;
  items: CartItemInterface[];
  promotion: PromotionItem | null;
  member: MemberItem | null;
  cashierName: string;
  branchName: string;
  orderType: OrderType;
  tableName: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    totalAmount: number;
    subtotal?: number;
    discountAmount?: number;
    tax?: number;
    cartItems?: CartItemInterface[];
    selectedPromotion?: PromotionItem | null | undefined;
    selectedMember?: MemberItem | null | undefined;
    cashierName?: string;
    branchName?: string;
    orderType?: OrderType;
    selectedTableId?: number | null;
    tables?: TableManagementItem[];
  }>(),
  {
    subtotal: 0,
    discountAmount: 0,
    tax: 0,
    cartItems: () => [],
    selectedPromotion: null,
    selectedMember: null,
    cashierName: 'พนักงานประจำเครื่อง',
    branchName: 'สาขาใหญ่ (Branch 001)',
    orderType: OrderType.DINE_IN,
    selectedTableId: null,
    tables: () => [],
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'success', data: { method: PaymentMethod; tendered: number; change: number }): void;
}>();

const currentStep = ref<'payment' | 'receipt'>('payment');
const selectedMethod = ref<PaymentMethod>(PaymentMethod.CASH);
const tenderedString = ref<string>('');
const isProcessing = ref<boolean>(false);
const showDrawerAnimation = ref<boolean>(false);
const receiptNumber = ref<string>('');
const receiptDate = ref<string>('');

const activeReceipt = ref<ReceiptSnapshotData>({
  totalAmount: 0,
  subtotal: 0,
  discountAmount: 0,
  tax: 0,
  items: [],
  promotion: null,
  member: null,
  cashierName: 'พนักงานประจำเครื่อง',
  branchName: 'สาขาใหญ่ (Branch 001)',
  orderType: OrderType.DINE_IN,
  tableName: '',
});

const methods = computed(() => [
  { value: PaymentMethod.CASH, label: t('pos.payment.methods.cash'), icon: 'payments' },
  { value: PaymentMethod.QR, label: t('pos.payment.methods.qr'), icon: 'qr_code_2' },
  { value: PaymentMethod.CREDIT_CARD, label: t('pos.payment.methods.credit'), icon: 'credit_card' },
  {
    value: PaymentMethod.TRUE_WALLET,
    label: t('pos.payment.methods.truemoney'),
    icon: 'account_balance_wallet',
  },
]);

const cashPresets = computed(() => [
  { label: t('pos.payment.exact'), value: props.totalAmount },
  { label: '฿100', value: 100 },
  { label: '฿500', value: 500 },
  { label: '฿1,000', value: 1000 },
]);

const keypadKeys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '00', '.'];

const calculatedChange = computed(() => {
  const tendered = Number(tenderedString.value) || 0;
  return Math.max(0, tendered - props.totalAmount);
});

const earnedPoints = computed(() => {
  return Math.floor(activeReceipt.value.totalAmount / 50);
});

const formatMemberName = (name?: string): string => {
  if (!name) return '';
  return name.startsWith('คุณ') ? name : `คุณ${name}`;
};

const getMethodLabel = (method: PaymentMethod): string => {
  switch (method) {
    case PaymentMethod.CASH:
      return 'เงินสด (CASH)';
    case PaymentMethod.QR:
      return 'สแกน QR PromptPay';
    case PaymentMethod.CREDIT_CARD:
      return 'บัตรเครดิต (CREDIT CARD)';
    case PaymentMethod.TRUE_WALLET:
      return 'True Wallet';
    default:
      return method;
  }
};

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      tenderedString.value = props.totalAmount.toString();
      selectedMethod.value = PaymentMethod.CASH;
      showDrawerAnimation.value = false;
      currentStep.value = 'payment';
    }
  },
);

const pressKey = (key: string): void => {
  if (key === '.' && tenderedString.value.includes('.')) return;
  tenderedString.value += key;
};

const clearKeypad = (): void => {
  tenderedString.value = '';
};

const backspaceKeypad = (): void => {
  tenderedString.value = tenderedString.value.slice(0, -1);
};

const applyPreset = (val: number): void => {
  tenderedString.value = val.toString();
};

const processPayment = (): void => {
  const selectedTableObj = props.tables?.find((t) => t.tableId === props.selectedTableId);
  const tableName = selectedTableObj
    ? selectedTableObj.tableNumber
    : props.selectedTableId
      ? `โต๊ะ #${props.selectedTableId}`
      : '';

  activeReceipt.value = {
    totalAmount: props.totalAmount,
    subtotal: props.subtotal || props.totalAmount,
    discountAmount: props.discountAmount || 0,
    tax: props.tax || 0,
    items:
      props.cartItems && props.cartItems.length > 0
        ? JSON.parse(JSON.stringify(props.cartItems))
        : [],
    promotion: props.selectedPromotion ? { ...props.selectedPromotion } : null,
    member: props.selectedMember ? { ...props.selectedMember } : null,
    cashierName: props.cashierName || 'พนักงานประจำเครื่อง',
    branchName: props.branchName || 'สาขาใหญ่ (Branch 001)',
    orderType: props.orderType || OrderType.DINE_IN,
    tableName,
  };

  if (selectedMethod.value === PaymentMethod.CASH) {
    showDrawerAnimation.value = true;
    $q.notify({
      type: 'positive',
      icon: 'door_sliding',
      message: t('pos.payment.drawerOpened'),
      position: 'top',
    });
  }

  const now = new Date();
  receiptNumber.value = `INV-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  receiptDate.value = now.toLocaleString('th-TH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Switch step to receipt immediately!
  currentStep.value = 'receipt';
};

const printReceipt = (): void => {
  $q.notify({
    type: 'positive',
    icon: 'print',
    message: 'กำลังส่งคำสั่งพิมพ์ใบเสร็จไปยังเครื่องพิมพ์...',
    position: 'top',
  });
  window.print();
};

const onFinish = (): void => {
  emit('success', {
    method: selectedMethod.value,
    tendered: Number(tenderedString.value) || props.totalAmount,
    change: calculatedChange.value,
  });
  currentStep.value = 'payment';
  emit('update:modelValue', false);
};
</script>

<style lang="scss" scoped>
@use '../../css/variables' as *;

.payment-dialog-body {
  font-family: $font-family-base;

  /* Step fade transition */
  .dialog-step-fade-enter-active,
  .dialog-step-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dialog-step-fade-enter-from {
    opacity: 0;
    transform: scale(0.97) translateY(8px);
  }

  .dialog-step-fade-leave-to {
    opacity: 0;
    transform: scale(0.97) translateY(-8px);
  }

  .payment-total-banner {
    background: linear-gradient(135deg, $color-primary-dark 0%, $color-primary 100%);
    color: #ffffff;
    border-radius: $radius-lg;
    box-shadow: 0 4px 14px rgba(99, 88, 128, 0.18);
    position: relative;
    overflow: hidden;

    .banner-sublabel {
      letter-spacing: 1px;
      opacity: 0.85;
      font-size: 11.5px;
    }

    .banner-amount {
      font-family: 'Plus Jakarta Sans', $font-family-base;
      letter-spacing: -0.5px;
      font-size: 28px;
      line-height: 34px;
    }
  }

  .payment-method-selector {
    .payment-method-btn {
      height: 56px;
      border: 1.5px solid $color-border-subtle;
      border-radius: $radius-lg;
      background: #ffffff;
      color: $color-text-body;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

      .method-icon-stage {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;

        .q-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
      }

      .method-label {
        font-size: 12px;
        white-space: nowrap;
      }

      &.method-cash {
        .method-icon-stage {
          background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
          color: #ffffff;
        }
      }

      &.method-qr {
        .method-icon-stage {
          background: linear-gradient(135deg, #14b8a6 0%, #0f766e 100%);
          color: #ffffff;
        }
      }

      &.method-credit_card {
        .method-icon-stage {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: #ffffff;
        }
      }

      &.method-truemoney {
        .method-icon-stage {
          background: linear-gradient(135deg, #f97316 0%, #c2410c 100%);
          color: #ffffff;
        }
      }

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
      }

      &.is-active {
        border-color: $color-primary;
        box-shadow: 0 4px 12px rgba(99, 88, 128, 0.16);
        background: linear-gradient(135deg, rgba(208, 195, 241, 0.2) 0%, #ffffff 100%);

        .method-label {
          color: $color-primary-dark;
          font-weight: 800;
        }

        .method-icon-stage {
          transform: scale(1.08);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
        }
      }
    }
  }

  /* Fixed height stage for zero layout shifts */
  .payment-method-stage {
    height: 330px;
    position: relative;
    overflow: hidden;

    .method-panel-content {
      height: 100%;
      width: 100%;
    }
  }

  /* Smooth slide & fade transition between payment methods */
  .method-slide-enter-active,
  .method-slide-leave-active {
    transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .method-slide-enter-from {
    opacity: 0;
    transform: translateX(16px);
  }

  .method-slide-leave-to {
    opacity: 0;
    transform: translateX(-16px);
  }

  .cash-display-grid {
    .amount-box {
      border: 1.5px solid $color-border-subtle;
      background: #f8fafc;
      border-radius: $radius-md;

      .box-label {
        font-size: 11.5px;
      }

      .box-val {
        font-size: 18px;
        line-height: 24px;
        font-family: 'Plus Jakarta Sans', $font-family-base;
      }

      &.change-box {
        &.is-sufficient {
          background: #f0fdf4;
          border-color: #86efac;
          color: #15803d;
        }

        &.is-deficit {
          background: #fef2f2;
          border-color: #fca5a5;
          color: #b91c1c;
        }
      }
    }
  }

  .preset-btn {
    height: 34px;
    font-size: 12.5px;
    border-radius: $radius-md;
    font-family: $font-family-base;
    color: $color-primary-dark !important;
    border-color: rgba(208, 195, 241, 0.7) !important;
    background: #ffffff !important;

    &:hover {
      background: rgba(208, 195, 241, 0.25) !important;
      border-color: $color-primary !important;
    }
  }

  .grid-keypad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;

    .key-btn {
      height: 38px;
      border-radius: $radius-md;
      border: 1px solid $color-border-subtle;
      background: #ffffff;
      color: $color-text-main;
      font:
        700 17px 'Plus Jakarta Sans',
        $font-family-base;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);

      &:hover {
        background: $color-bg-subtle;
        border-color: $color-primary;
      }

      &:active {
        transform: scale(0.97);
      }
    }
  }

  .keypad-actions-row {
    .key-btn {
      height: 38px;
      border-radius: $radius-md;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
      font: 700 14px $font-family-base;
      transition: all 0.15s ease;

      &:active {
        transform: scale(0.97);
      }

      &--danger {
        background: #ffe4e6;
        color: #be123c;
        border: 1px solid #fecdd3;

        &:hover {
          background: #fecdd3;
        }
      }

      &--warning {
        background: #fef3c7;
        color: #b45309;
        border: 1px solid #fde68a;

        &:hover {
          background: #fde68a;
        }
      }
    }
  }

  .cash-drawer-banner {
    background: #fffbeb;
    border: 1px solid #fde68a;
    color: #b45309;
    font-family: $font-family-base;
    border-radius: $radius-md;
  }

  .submit-pay-btn {
    height: 48px;
    border-radius: $radius-full;
    border: none;
    cursor: pointer;
    font-family: $font-family-base;
    font-size: 16px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.32);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    .btn-icon-circle {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.22);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .q-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }
    }

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(16, 185, 129, 0.42);
      background: linear-gradient(135deg, #34d399 0%, #059669 100%);

      .btn-icon-circle {
        background: rgba(255, 255, 255, 0.32);
      }
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      background: #cbd5e1;
      box-shadow: none;
    }
  }

  /* Thermal Receipt Styling (Clean crisp storefront header icon) */
  .receipt-step-container {
    .thermal-receipt-paper {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);

      /* Uniform monospace font rules for text elements */
      &,
      div:not(.q-icon):not(.receipt-header-icon),
      span:not(.q-icon),
      p,
      td,
      th,
      table,
      tr {
        font-family: 'Courier New', Courier, monospace !important;
        font-size: 12px !important;
        font-weight: 400 !important;
        color: #1e293b !important;
        line-height: 1.65 !important;
      }

      .q-icon {
        font-family: 'Material Icons', 'Material Icons Outlined', sans-serif !important;
      }

      .receipt-header-icon {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 1.5px solid #cbd5e1;
        background: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: center;

        .q-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
      }

      .receipt-dashed-line {
        border-top: 1.5px dashed #94a3b8;
      }

      .receipt-solid-line {
        border-top: 1.5px solid #0f172a;
      }

      .receipt-member-box {
        background: #f8fafc;
        border: 1px dashed #cbd5e1;
      }

      .receipt-table-wrapper {
        max-height: 125px;
        overflow-y: auto;

        &::-webkit-scrollbar {
          width: 4px;
        }
        &::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
      }

      .receipt-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;

        th,
        td {
          padding: 4px 2px;
          vertical-align: middle;
          box-sizing: border-box;
        }

        th {
          border-bottom: 1.5px solid #0f172a;
          font-weight: 400 !important;
        }

        .col-name {
          width: 44%;
          text-align: left;
        }

        .col-qty {
          width: 16%;
          text-align: center;
        }

        .col-price {
          width: 20%;
          text-align: right;
        }

        .col-total {
          width: 20%;
          text-align: right;
        }

        .item-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .barcode-wrapper {
        .barcode-lines {
          height: 20px;
          .bar-line {
            background: #0f172a;
            display: inline-block;
          }
        }
      }
    }

    .btn-receipt-action {
      height: 40px;
      border: none;
      cursor: pointer;
      font-family: $font-family-base;
      font-size: 14px;
      transition: all 0.2s ease;

      &.btn-print {
        background: #f1f5f9;
        color: #1e293b;
        border: 1px solid #cbd5e1;

        &:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
      }

      &.btn-finish {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

        &:hover {
          background: linear-gradient(135deg, #34d399 0%, #059669 100%);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }
      }
    }
  }

  .font-sarabun {
    font-family: $font-family-base;
  }
}
</style>

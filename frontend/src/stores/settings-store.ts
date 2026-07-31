import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type {
  StoreProfileConfig,
  HardwareSettingsConfig,
  PaymentTaxConfig,
  SecuritySystemConfig,
  PrinterConfig,
} from '@/types/settings';

const DEFAULT_STORE: StoreProfileConfig = {
  storeName: 'i4estyle Cafe & Bistro',
  branchName: 'Downtown Branch',
  taxId: '0105567012345',
  phone: '02-123-4567',
  email: 'contact@i4estyle.com',
  address: '123 Sukhumvit Road, Watthana, Bangkok 10110',
  receiptHeader: 'Welcome to i4estyle Cafe',
  receiptFooter: 'Thank you for visiting us!',
  currency: 'THB (฿)',
  timezone: 'Asia/Bangkok (GMT+7)',
  dateFormat: 'DD/MM/YYYY',
};

const DEFAULT_HARDWARE: HardwareSettingsConfig = {
  printers: [
    {
      id: 'p1',
      name: 'Counter Main Thermal Printer',
      type: 'Network (LAN/IP)',
      ipAddress: '192.168.1.200',
      paperWidth: '80 mm',
      autoCut: true,
      printLogo: true,
      isDefault: true,
    },
    {
      id: 'p2',
      name: 'Kitchen Order Printer',
      type: 'Network (LAN/IP)',
      ipAddress: '192.168.1.201',
      paperWidth: '80 mm',
      autoCut: true,
      printLogo: false,
      isDefault: false,
    },
  ],
  cashDrawer: {
    autoOpen: true,
  },
  customerDisplay: {
    enable: true,
    slideshow: true,
  },
  scanner: {
    autoSubmit: true,
    soundBeep: true,
  },
};

const DEFAULT_PAYMENT_TAX: PaymentTaxConfig = {
  methods: [
    { id: 'm1', name: 'Cash', code: 'cash', isEnabled: true, icon: 'payments', isSystem: true },
    {
      id: 'm2',
      name: 'PromptPay QR',
      code: 'promptpay',
      isEnabled: true,
      icon: 'qr_code_2',
      isSystem: true,
    },
    {
      id: 'm3',
      name: 'Credit Card',
      code: 'credit_card',
      isEnabled: true,
      icon: 'credit_card',
      isSystem: true,
    },
    {
      id: 'm4',
      name: 'TrueMoney Wallet',
      code: 'truemoney',
      isEnabled: true,
      icon: 'account_balance_wallet',
      isSystem: false,
    },
  ],
  promptpay: {
    merchantId: '0812345678',
    merchantName: 'i4estyle POS Official',
  },
  tax: {
    vatRate: 7,
    vatType: 'included',
    serviceCharge: 10,
    enableServiceCharge: false,
  },
};

const DEFAULT_SECURITY: SecuritySystemConfig = {
  pinPolicy: {
    voidRequirePin: true,
    discountRequirePin: true,
    drawerRequirePin: false,
  },
  autoLock: {
    timeout: 'minutes10',
  },
  backup: {
    cloudSync: true,
    lastSync: 'Today 08:30 AM',
  },
};

export const useSettingsStore = defineStore('settings', () => {
  const loadState = <T>(key: string, fallback: T): T => {
    const raw = sessionStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  };

  const storeProfile = ref<StoreProfileConfig>(loadState('pos_store_profile', DEFAULT_STORE));
  const hardware = ref<HardwareSettingsConfig>(loadState('pos_hardware', DEFAULT_HARDWARE));
  const paymentTax = ref<PaymentTaxConfig>(loadState('pos_payment_tax', DEFAULT_PAYMENT_TAX));
  const security = ref<SecuritySystemConfig>(loadState('pos_security', DEFAULT_SECURITY));

  watch(storeProfile, (val) => sessionStorage.setItem('pos_store_profile', JSON.stringify(val)), {
    deep: true,
  });
  watch(hardware, (val) => sessionStorage.setItem('pos_hardware', JSON.stringify(val)), {
    deep: true,
  });
  watch(paymentTax, (val) => sessionStorage.setItem('pos_payment_tax', JSON.stringify(val)), {
    deep: true,
  });
  watch(security, (val) => sessionStorage.setItem('pos_security', JSON.stringify(val)), {
    deep: true,
  });

  /* Store Profile CRUD */
  const updateStoreProfile = (payload: Partial<StoreProfileConfig>): void => {
    Object.assign(storeProfile.value, payload);
  };

  /* Printer CRUD */
  const addPrinter = (payload: Omit<PrinterConfig, 'id'>): void => {
    const newId = `p_${Date.now()}`;
    const isFirst = hardware.value.printers.length === 0;
    hardware.value.printers.push({
      ...payload,
      id: newId,
      isDefault: payload.isDefault || isFirst,
    });
  };

  const updatePrinter = (id: string, payload: Partial<Omit<PrinterConfig, 'id'>>): void => {
    const existing = hardware.value.printers.find((p) => p.id === id);
    if (existing) {
      Object.assign(existing, payload);
    }
  };

  const deletePrinter = (id: string): void => {
    hardware.value.printers = hardware.value.printers.filter((p) => p.id !== id);
  };

  const setDefaultPrinter = (id: string): void => {
    hardware.value.printers.forEach((p) => {
      p.isDefault = p.id === id;
    });
  };

  /* Payment Method CRUD */
  const addPaymentMethod = (name: string, icon: string): void => {
    const newId = `m_${Date.now()}`;
    paymentTax.value.methods.push({
      id: newId,
      name,
      code: name.toLowerCase().replace(/\s+/g, '_'),
      isEnabled: true,
      icon,
      isSystem: false,
    });
  };

  const togglePaymentMethod = (id: string): void => {
    const item = paymentTax.value.methods.find((m) => m.id === id);
    if (item) {
      item.isEnabled = !item.isEnabled;
    }
  };

  const deletePaymentMethod = (id: string): void => {
    paymentTax.value.methods = paymentTax.value.methods.filter((m) => m.id !== id || m.isSystem);
  };

  /* Reset Factory Defaults */
  const resetToDefaults = (): void => {
    storeProfile.value = JSON.parse(JSON.stringify(DEFAULT_STORE)) as StoreProfileConfig;
    hardware.value = JSON.parse(JSON.stringify(DEFAULT_HARDWARE)) as HardwareSettingsConfig;
    paymentTax.value = JSON.parse(JSON.stringify(DEFAULT_PAYMENT_TAX)) as PaymentTaxConfig;
    security.value = JSON.parse(JSON.stringify(DEFAULT_SECURITY)) as SecuritySystemConfig;
  };

  return {
    storeProfile,
    hardware,
    paymentTax,
    security,
    updateStoreProfile,
    addPrinter,
    updatePrinter,
    deletePrinter,
    setDefaultPrinter,
    addPaymentMethod,
    togglePaymentMethod,
    deletePaymentMethod,
    resetToDefaults,
  };
});

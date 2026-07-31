export interface PrinterConfig {
  id: string;
  name: string;
  type: string;
  ipAddress: string;
  paperWidth: string;
  autoCut: boolean;
  printLogo: boolean;
  isDefault: boolean;
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  code: string;
  isEnabled: boolean;
  icon: string;
  isSystem: boolean;
}

export interface StoreProfileConfig {
  storeName: string;
  branchName: string;
  taxId: string;
  phone: string;
  email: string;
  address: string;
  receiptHeader: string;
  receiptFooter: string;
  currency: string;
  timezone: string;
  dateFormat: string;
}

export interface HardwareSettingsConfig {
  printers: PrinterConfig[];
  cashDrawer: {
    autoOpen: boolean;
  };
  customerDisplay: {
    enable: boolean;
    slideshow: boolean;
  };
  scanner: {
    autoSubmit: boolean;
    soundBeep: boolean;
  };
}

export interface PaymentTaxConfig {
  methods: PaymentMethodConfig[];
  promptpay: {
    merchantId: string;
    merchantName: string;
  };
  tax: {
    vatRate: number;
    vatType: 'included' | 'excluded';
    serviceCharge: number;
    enableServiceCharge: boolean;
  };
}

export interface SecuritySystemConfig {
  pinPolicy: {
    voidRequirePin: boolean;
    discountRequirePin: boolean;
    drawerRequirePin: boolean;
  };
  autoLock: {
    timeout: 'never' | 'minutes5' | 'minutes10' | 'minutes15';
  };
  backup: {
    cloudSync: boolean;
    lastSync: string;
  };
}

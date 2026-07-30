export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export const tableStatusFlow: readonly TableStatus[] = [
  'available',
  'occupied',
  'cleaning',
  'reserved',
];

export interface DiningTableInterface {
  tableId: number;
  branchId: number;
  tableNumber: string;
  capacity: number;
  status: TableStatus;
}

export interface TableManagementItem extends DiningTableInterface {
  timeSeated?: string | undefined;
  totalAmount?: number | undefined;
  reservedTime?: string | undefined;
  reservedName?: string | undefined;
  estimatedCleaningMinutes?: number | undefined;
  cleaningProgress?: number | undefined;
  descriptionKey?: string | undefined;
}

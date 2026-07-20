export interface DiningTableInterface {
  tableId: number;
  branchId: number;
  tableNumber: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
}

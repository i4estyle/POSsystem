export interface BranchInterface {
  branchId: number;
  branchCode: string;
  branchName: string;
  address?: string | null;
  phone?: string | null;
  status: 'active' | 'inactive';
}

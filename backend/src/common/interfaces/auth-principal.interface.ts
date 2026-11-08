import { RoleName } from '../enums';

export interface AuthPrincipal {
  employeeId: number;
  branchId: number;
  roleId: number;
  roleName: RoleName;
}

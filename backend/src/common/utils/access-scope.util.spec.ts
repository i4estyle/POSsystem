import { ForbiddenException } from '@nestjs/common';
import { RoleName } from '../enums';
import { assertBranchAccess, resolveBranchId } from './access-scope.util';

describe('access scope', () => {
  const manager = {
    employeeId: 2,
    branchId: 3,
    roleId: 2,
    roleName: RoleName.MANAGER,
  };
  const admin = {
    employeeId: 1,
    branchId: 1,
    roleId: 1,
    roleName: RoleName.ADMIN,
  };

  it('forces non-admin users to their branch', () => {
    expect(resolveBranchId(manager)).toBe(3);
    expect(() => resolveBranchId(manager, 4)).toThrow(ForbiddenException);
  });

  it('allows admins to select another branch', () => {
    expect(resolveBranchId(admin, 4)).toBe(4);
    expect(() => assertBranchAccess(admin, 4)).not.toThrow();
  });
});

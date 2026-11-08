import { ForbiddenException } from '@nestjs/common';
import { RoleName } from '../enums';
import { AuthPrincipal } from '../interfaces/auth-principal.interface';

export const resolveBranchId = (
  principal: AuthPrincipal,
  requestedBranchId?: number,
): number => {
  if (principal.roleName === RoleName.ADMIN) {
    return requestedBranchId ?? principal.branchId;
  }
  if (requestedBranchId && requestedBranchId !== principal.branchId) {
    throw new ForbiddenException('Cross-branch access denied');
  }
  return principal.branchId;
};

export const assertBranchAccess = (
  principal: AuthPrincipal,
  branchId: number,
): void => {
  resolveBranchId(principal, branchId);
};

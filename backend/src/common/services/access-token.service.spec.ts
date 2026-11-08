import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AccessTokenService } from './access-token.service';
import { RoleName } from '../enums';

describe('AccessTokenService', () => {
  const service = new AccessTokenService(
    new ConfigService({
      AUTH_TOKEN_SECRET: '0123456789abcdef0123456789abcdef',
      AUTH_TOKEN_TTL_SECONDS: 60,
    }),
  );

  it('signs and verifies a principal', () => {
    const principal = {
      employeeId: 7,
      branchId: 3,
      roleId: 2,
      roleName: RoleName.MANAGER,
    };
    expect(service.verify(service.sign(principal))).toEqual(principal);
  });

  it('rejects a modified token', () => {
    const token = service.sign({
      employeeId: 7,
      branchId: 3,
      roleId: 2,
      roleName: RoleName.MANAGER,
    });
    expect(() => service.verify(`${token}x`)).toThrow(UnauthorizedException);
  });
});

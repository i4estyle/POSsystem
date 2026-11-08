import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import { AuthPrincipal } from '../interfaces/auth-principal.interface';
import { RoleName } from '../enums';

interface TokenPayload extends AuthPrincipal {
  exp: number;
}

@Injectable()
export class AccessTokenService {
  private readonly secret: string;
  private readonly ttlSeconds: number;

  constructor(configService: ConfigService) {
    const secret = configService.get<string>('AUTH_TOKEN_SECRET');
    if (!secret || secret.length < 32) {
      throw new Error('AUTH_TOKEN_SECRET must contain at least 32 characters');
    }
    this.secret = secret;
    this.ttlSeconds =
      configService.get<number>('AUTH_TOKEN_TTL_SECONDS') ?? 28800;
  }

  sign(principal: AuthPrincipal): string {
    const payload: TokenPayload = {
      ...principal,
      exp: Math.floor(Date.now() / 1000) + this.ttlSeconds,
    };
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return `${encoded}.${this.signature(encoded)}`;
  }

  verify(token: string): AuthPrincipal {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) {
      throw new UnauthorizedException('Invalid access token');
    }
    const expected = Buffer.from(this.signature(encoded));
    const actual = Buffer.from(signature);
    if (
      expected.length !== actual.length ||
      !timingSafeEqual(expected, actual)
    ) {
      throw new UnauthorizedException('Invalid access token');
    }
    const payload = this.parsePayload(encoded);
    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Access token expired');
    }
    return {
      employeeId: payload.employeeId,
      branchId: payload.branchId,
      roleId: payload.roleId,
      roleName: payload.roleName,
    };
  }

  private signature(encoded: string): string {
    return createHmac('sha256', this.secret)
      .update(encoded)
      .digest('base64url');
  }

  private parsePayload(encoded: string): TokenPayload {
    try {
      const value: unknown = JSON.parse(
        Buffer.from(encoded, 'base64url').toString('utf8'),
      );
      if (!this.isTokenPayload(value)) {
        throw new Error();
      }
      return value;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private isTokenPayload(value: unknown): value is TokenPayload {
    if (!value || typeof value !== 'object') return false;
    const payload = value as Record<string, unknown>;
    return (
      Number.isInteger(payload.employeeId) &&
      Number.isInteger(payload.branchId) &&
      Number.isInteger(payload.roleId) &&
      Object.values(RoleName).includes(payload.roleName as RoleName) &&
      Number.isInteger(payload.exp)
    );
  }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthPrincipal } from '../interfaces/auth-principal.interface';

export const AuthUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthPrincipal => {
    const request = context.switchToHttp().getRequest();
    return (request.auth || (request as any).user) as AuthPrincipal;
  },
);

import { SetMetadata } from '@nestjs/common';
import { RoleName } from '../enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleName[]): MethodDecorator & ClassDecorator =>
  SetMetadata(ROLES_KEY, roles);

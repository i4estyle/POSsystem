import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from '../employees/entities/employee.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenService } from '../../common/services/access-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity])],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenService],
  exports: [AuthService, AccessTokenService],
})
export class AuthModule {}

import {
  ConflictException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeEntity } from '../employees/entities/employee.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, AuthUserDto } from './dto/auth-response.dto';
import { hashPassword, verifyPassword } from '../../common/utils/hash.util';
import { AccessTokenService } from '../../common/services/access-token.service';
import { RoleName } from '../../common/enums';
import { AuthPrincipal } from '../../common/interfaces/auth-principal.interface';
import { resolveBranchId } from '../../common/utils/access-scope.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
    private readonly accessTokenService: AccessTokenService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const employee = await this.employeeRepository.findOne({
      where: [{ username: dto.account }, { email: dto.account }],
      relations: ['branch', 'role'],
    });

    if (!employee) {
      throw new UnauthorizedException(
        'ชื่อผู้ใช้งาน/อีเมล หรือรหัสผ่านไม่ถูกต้อง',
      );
    }

    const isMatch = await verifyPassword(dto.password, employee.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException(
        'ชื่อผู้ใช้งาน/อีเมล หรือรหัสผ่านไม่ถูกต้อง',
      );
    }

    return {
      accessToken: this.createAccessToken(employee),
      user: this.mapToUserDto(employee),
    };
  }

  async register(
    dto: RegisterDto,
    principal: AuthPrincipal,
  ): Promise<AuthResponseDto> {
    const existingUsername = await this.employeeRepository.findOne({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new ConflictException('ชื่อผู้ใช้งานนี้ถูกใช้งานในระบบแล้ว');
    }

    const existingEmail = await this.employeeRepository.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException('อีเมลนี้ถูกใช้งานในระบบแล้ว');
    }

    if (dto.nationalId) {
      const existingNationalId = await this.employeeRepository.findOne({
        where: { nationalId: dto.nationalId },
      });
      if (existingNationalId) {
        throw new ConflictException(
          'เลขบัตรประจำตัวประชาชนนี้ถูกใช้งานในระบบแล้ว',
        );
      }
    }

    const hashedPassword = await hashPassword(dto.password);

    const newEmployee = this.employeeRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      email: dto.email,
      username: dto.username,
      passwordHash: hashedPassword,
      nationalId: dto.nationalId,
      address: dto.address,
      titlePrefix: dto.titlePrefix,
      profileImage: dto.profileImage,
      branchId: resolveBranchId(principal, dto.branchId),
      roleId: this.getRegistrationRoleId(),
      hireDate: new Date(),
    });

    const saved = await this.employeeRepository.save(newEmployee);
    const fullSaved = await this.employeeRepository.findOne({
      where: { employeeId: saved.employeeId },
      relations: ['branch', 'role'],
    });

    return {
      accessToken: this.createAccessToken(fullSaved || saved),
      user: this.mapToUserDto(fullSaved || saved),
    };
  }

  async checkAvailability(
    field: 'username' | 'email' | 'nationalId',
    value: string,
  ): Promise<{ available: boolean; message?: string }> {
    if (!value || !value.trim()) {
      return { available: true };
    }

    const val = value.trim();

    if (field === 'username') {
      const existing = await this.employeeRepository.findOne({
        where: { username: val },
      });
      if (existing) {
        return {
          available: false,
          message: 'ชื่อผู้ใช้งานนี้ถูกใช้งานในระบบแล้ว',
        };
      }
    } else if (field === 'email') {
      const existing = await this.employeeRepository.findOne({
        where: { email: val },
      });
      if (existing) {
        return {
          available: false,
          message: 'อีเมลนี้ถูกใช้งานในระบบแล้ว',
        };
      }
    } else if (field === 'nationalId') {
      const existing = await this.employeeRepository.findOne({
        where: { nationalId: val },
      });
      if (existing) {
        return {
          available: false,
          message: 'เลขบัตรประจำตัวประชาชนนี้ถูกใช้งานในระบบแล้ว',
        };
      }
    }

    return { available: true };
  }

  private mapToUserDto(employee: EmployeeEntity): AuthUserDto {
    return {
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      username: employee.username,
      phone: employee.phone,
      branchId: employee.branchId,
      branchName: employee.branch?.branchName,
      roleId: employee.roleId,
      roleName: employee.role?.roleName,
      address: employee.address,
      titlePrefix: employee.titlePrefix,
      profileImage: employee.profileImage,
      status: employee.status,
    };
  }

  private createAccessToken(employee: EmployeeEntity): string {
    return this.accessTokenService.sign({
      employeeId: employee.employeeId,
      branchId: employee.branchId,
      roleId: employee.roleId,
      roleName: employee.role.roleName as RoleName,
    });
  }

  private getRegistrationRoleId(): number {
    const roleId = this.configService.get<number>(
      'DEFAULT_REGISTRATION_ROLE_ID',
    );
    if (!roleId || !Number.isInteger(roleId)) {
      throw new ServiceUnavailableException(
        'DEFAULT_REGISTRATION_ROLE_ID is not configured',
      );
    }
    return roleId;
  }
}

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeEntity } from '../employees/entities/employee.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, AuthUserDto } from './dto/auth-response.dto';
import { hashPassword, verifyPassword } from '../../common/utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const employee = await this.employeeRepository.findOne({
      where: [{ username: dto.account }, { email: dto.account }],
      relations: ['branch'],
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
      accessToken: `mock-jwt-token-${employee.employeeId}-${Date.now()}`,
      user: this.mapToUserDto(employee),
    };
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
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
      branchId: dto.branchId || 1,
      roleId: 2,
      hireDate: new Date(),
    });

    const saved = await this.employeeRepository.save(newEmployee);
    const fullSaved = await this.employeeRepository.findOne({
      where: { employeeId: saved.employeeId },
      relations: ['branch'],
    });

    return {
      accessToken: `mock-jwt-token-${saved.employeeId}-${Date.now()}`,
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
      nationalId: employee.nationalId,
      address: employee.address,
      titlePrefix: employee.titlePrefix,
      profileImage: employee.profileImage,
      status: employee.status,
    };
  }
}

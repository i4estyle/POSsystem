import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeEntity } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { RoleName } from '../../common/enums';
import { hashPassword } from '../../common/utils/hash.util';
import { AuthPrincipal } from '../../common/interfaces/auth-principal.interface';
import {
  assertBranchAccess,
  resolveBranchId,
} from '../../common/utils/access-scope.util';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
  ) {}

  async create(
    dto: CreateEmployeeDto,
    principal: AuthPrincipal,
  ): Promise<EmployeeEntity> {
    const existingEmail = await this.employeeRepository.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException('อีเมลนี้ถูกใช้งานในระบบแล้ว');
    }
    const existingUsername = await this.employeeRepository.findOne({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new ConflictException('ชื่อผู้ใช้งานนี้ถูกใช้งานในระบบแล้ว');
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
    const hashedPassword = await hashPassword(dto.passwordHash);
    const employee = this.employeeRepository.create({
      ...dto,
      branchId: resolveBranchId(principal, dto.branchId),
      passwordHash: hashedPassword,
    });
    return this.employeeRepository.save(employee);
  }

  async findAll(
    pagination: PaginationQueryDto,
    principal: AuthPrincipal,
  ): Promise<{
    data: EmployeeEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.employeeRepository.findAndCount({
      where:
        principal.roleName === RoleName.ADMIN
          ? undefined
          : { branchId: principal.branchId },
      relations: ['branch', 'role'],
      skip: (page - 1) * limit,
      take: limit,
      order: { employeeId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number, principal: AuthPrincipal): Promise<EmployeeEntity> {
    const employee = await this.employeeRepository.findOne({
      where: { employeeId: id },
      relations: ['branch', 'role'],
    });
    if (!employee) {
      throw new NotFoundException(`Employee #${id} not found`);
    }
    assertBranchAccess(principal, employee.branchId);
    return employee;
  }

  async update(
    id: number,
    dto: UpdateEmployeeDto,
    principal: AuthPrincipal,
  ): Promise<EmployeeEntity> {
    const employee = await this.findOne(id, principal);
    if (dto.email && dto.email !== employee.email) {
      const existingEmail = await this.employeeRepository.findOne({
        where: { email: dto.email },
      });
      if (existingEmail) {
        throw new ConflictException('อีเมลนี้ถูกใช้งานในระบบแล้ว');
      }
    }
    if (dto.username && dto.username !== employee.username) {
      const existingUsername = await this.employeeRepository.findOne({
        where: { username: dto.username },
      });
      if (existingUsername) {
        throw new ConflictException('ชื่อผู้ใช้งานนี้ถูกใช้งานในระบบแล้ว');
      }
    }
    if (dto.nationalId && dto.nationalId !== employee.nationalId) {
      const existingNationalId = await this.employeeRepository.findOne({
        where: { nationalId: dto.nationalId },
      });
      if (existingNationalId) {
        throw new ConflictException(
          'เลขบัตรประจำตัวประชาชนนี้ถูกใช้งานในระบบแล้ว',
        );
      }
    }
    Object.assign(employee, dto, {
      branchId: resolveBranchId(principal, dto.branchId ?? employee.branchId),
    });
    if (dto.passwordHash) {
      employee.passwordHash = await hashPassword(dto.passwordHash);
    }
    return this.employeeRepository.save(employee);
  }

  async remove(id: number, principal: AuthPrincipal): Promise<void> {
    const employee = await this.findOne(id, principal);
    await this.employeeRepository.softRemove(employee);
  }
}

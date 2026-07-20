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
import { hashPassword } from '../../common/utils/hash.util';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
  ) {}

  async create(dto: CreateEmployeeDto): Promise<EmployeeEntity> {
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
      passwordHash: hashedPassword,
    });
    return this.employeeRepository.save(employee);
  }

  async findAll(pagination: PaginationQueryDto): Promise<{
    data: EmployeeEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.employeeRepository.findAndCount({
      relations: ['branch', 'role'],
      skip: (page - 1) * limit,
      take: limit,
      order: { employeeId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<EmployeeEntity> {
    const employee = await this.employeeRepository.findOne({
      where: { employeeId: id },
      relations: ['branch', 'role'],
    });
    if (!employee) {
      throw new NotFoundException(`Employee #${id} not found`);
    }
    return employee;
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<EmployeeEntity> {
    const employee = await this.findOne(id);
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
    Object.assign(employee, dto);
    return this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepository.softRemove(employee);
  }
}

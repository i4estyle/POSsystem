import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalaryEntity } from './entities/salary.entity';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class SalariesService {
  constructor(
    @InjectRepository(SalaryEntity)
    private readonly salaryRepository: Repository<SalaryEntity>,
  ) {}

  async create(dto: CreateSalaryDto): Promise<SalaryEntity> {
    const bonus = dto.bonus ?? 0;
    const deduction = dto.deduction ?? 0;
    const netSalary =
      Number(dto.baseSalary) + Number(bonus) - Number(deduction);
    const salary = this.salaryRepository.create({
      ...dto,
      bonus,
      deduction,
      netSalary,
    });
    return this.salaryRepository.save(salary);
  }

  async findAll(pagination: PaginationQueryDto): Promise<{
    data: SalaryEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.salaryRepository.findAndCount({
      relations: ['employee'],
      skip: (page - 1) * limit,
      take: limit,
      order: { salaryId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<SalaryEntity> {
    const salary = await this.salaryRepository.findOne({
      where: { salaryId: id },
      relations: ['employee'],
    });
    if (!salary) {
      throw new NotFoundException(`Salary record #${id} not found`);
    }
    return salary;
  }

  async update(id: number, dto: UpdateSalaryDto): Promise<SalaryEntity> {
    const salary = await this.findOne(id);
    const baseSalary = dto.baseSalary ?? salary.baseSalary;
    const bonus = dto.bonus ?? salary.bonus;
    const deduction = dto.deduction ?? salary.deduction;
    const netSalary = Number(baseSalary) + Number(bonus) - Number(deduction);
    Object.assign(salary, { ...dto, netSalary });
    return this.salaryRepository.save(salary);
  }

  async remove(id: number): Promise<void> {
    const salary = await this.findOne(id);
    await this.salaryRepository.softRemove(salary);
  }
}

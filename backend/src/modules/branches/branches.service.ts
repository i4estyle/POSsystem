import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchEntity } from './entities/branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(BranchEntity)
    private readonly branchRepository: Repository<BranchEntity>,
  ) {}

  async create(dto: CreateBranchDto): Promise<BranchEntity> {
    const branch = this.branchRepository.create(dto);
    return this.branchRepository.save(branch);
  }

  async findAll(pagination: PaginationQueryDto): Promise<{
    data: BranchEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.branchRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { branchId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<BranchEntity> {
    const branch = await this.branchRepository.findOne({
      where: { branchId: id },
    });
    if (!branch) {
      throw new NotFoundException(`Branch #${id} not found`);
    }
    return branch;
  }

  async update(id: number, dto: UpdateBranchDto): Promise<BranchEntity> {
    const branch = await this.findOne(id);
    Object.assign(branch, dto);
    return this.branchRepository.save(branch);
  }

  async remove(id: number): Promise<void> {
    const branch = await this.findOne(id);
    await this.branchRepository.softRemove(branch);
  }
}

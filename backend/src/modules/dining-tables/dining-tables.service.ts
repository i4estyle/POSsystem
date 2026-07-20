import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiningTableEntity } from './entities/dining-table.entity';
import { CreateDiningTableDto } from './dto/create-dining-table.dto';
import { UpdateDiningTableDto } from './dto/update-dining-table.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class DiningTablesService {
  constructor(
    @InjectRepository(DiningTableEntity)
    private readonly tableRepository: Repository<DiningTableEntity>,
  ) {}

  async create(dto: CreateDiningTableDto): Promise<DiningTableEntity> {
    const table = this.tableRepository.create(dto);
    return this.tableRepository.save(table);
  }

  async findAll(pagination: PaginationQueryDto): Promise<{
    data: DiningTableEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.tableRepository.findAndCount({
      relations: ['branch'],
      skip: (page - 1) * limit,
      take: limit,
      order: { tableId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<DiningTableEntity> {
    const table = await this.tableRepository.findOne({
      where: { tableId: id },
      relations: ['branch'],
    });
    if (!table) {
      throw new NotFoundException(`Dining Table #${id} not found`);
    }
    return table;
  }

  async update(
    id: number,
    dto: UpdateDiningTableDto,
  ): Promise<DiningTableEntity> {
    const table = await this.findOne(id);
    Object.assign(table, dto);
    return this.tableRepository.save(table);
  }

  async remove(id: number): Promise<void> {
    const table = await this.findOne(id);
    await this.tableRepository.softRemove(table);
  }
}

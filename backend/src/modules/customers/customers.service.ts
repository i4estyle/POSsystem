import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async create(dto: CreateCustomerDto): Promise<CustomerEntity> {
    const existingPhone = await this.customerRepository.findOne({
      where: { phone: dto.phone },
    });
    if (existingPhone) {
      throw new ConflictException('Phone number already registered');
    }
    const customer = this.customerRepository.create({
      ...dto,
      registerDate: dto.registerDate ? new Date(dto.registerDate) : new Date(),
    });
    return this.customerRepository.save(customer);
  }

  async findAll(pagination: PaginationQueryDto): Promise<{
    data: CustomerEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.customerRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { customerId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOne({
      where: { customerId: id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return customer;
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<CustomerEntity> {
    const customer = await this.findOne(id);
    if (dto.phone && dto.phone !== customer.phone) {
      const existingPhone = await this.customerRepository.findOne({
        where: { phone: dto.phone },
      });
      if (existingPhone) {
        throw new ConflictException('Phone number already registered');
      }
    }
    Object.assign(customer, {
      ...dto,
      registerDate: dto.registerDate
        ? new Date(dto.registerDate)
        : customer.registerDate,
    });
    return this.customerRepository.save(customer);
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.softRemove(customer);
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockEntity } from './entities/stock.entity';
import { StockMovementEntity } from './entities/stock-movement.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { MovementType } from '../../common/enums';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,
    @InjectRepository(StockMovementEntity)
    private readonly movementRepository: Repository<StockMovementEntity>,
  ) {}

  async createStock(dto: CreateStockDto): Promise<StockEntity> {
    const stock = this.stockRepository.create(dto);
    return this.stockRepository.save(stock);
  }

  async findAllStocks(pagination: PaginationQueryDto): Promise<{
    data: StockEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.stockRepository.findAndCount({
      relations: ['product', 'branch'],
      skip: (page - 1) * limit,
      take: limit,
      order: { stockId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOneStock(id: number): Promise<StockEntity> {
    const stock = await this.stockRepository.findOne({
      where: { stockId: id },
      relations: ['product', 'branch'],
    });
    if (!stock) {
      throw new NotFoundException(`Stock #${id} not found`);
    }
    return stock;
  }

  async updateStock(id: number, dto: UpdateStockDto): Promise<StockEntity> {
    const stock = await this.findOneStock(id);
    Object.assign(stock, dto);
    return this.stockRepository.save(stock);
  }

  async removeStock(id: number): Promise<void> {
    const stock = await this.findOneStock(id);
    await this.stockRepository.softRemove(stock);
  }

  async recordMovement(
    dto: CreateStockMovementDto,
  ): Promise<StockMovementEntity> {
    let stock = await this.stockRepository.findOne({
      where: { productId: dto.productId, branchId: dto.branchId },
    });

    if (!stock) {
      stock = this.stockRepository.create({
        productId: dto.productId,
        branchId: dto.branchId,
        quantity: 0,
        reorderLevel: 0,
      });
    }

    if (dto.movementType === MovementType.IN) {
      stock.quantity += dto.quantity;
    } else if (dto.movementType === MovementType.OUT) {
      if (stock.quantity < dto.quantity) {
        throw new BadRequestException('Insufficient stock quantity');
      }
      stock.quantity -= dto.quantity;
    } else if (dto.movementType === MovementType.ADJUST) {
      stock.quantity = dto.quantity;
    }

    await this.stockRepository.save(stock);

    const movement = this.movementRepository.create(dto);
    return this.movementRepository.save(movement);
  }

  async findAllMovements(pagination: PaginationQueryDto): Promise<{
    data: StockMovementEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.movementRepository.findAndCount({
      relations: ['product', 'branch', 'employee'],
      skip: (page - 1) * limit,
      take: limit,
      order: { movementId: 'DESC' },
    });
    return { data, total, page, limit };
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { MovementType, RoleName } from '../../common/enums';
import { AuthPrincipal } from '../../common/interfaces/auth-principal.interface';
import {
  assertBranchAccess,
  resolveBranchId,
} from '../../common/utils/access-scope.util';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { StockMovementEntity } from './entities/stock-movement.entity';
import { StockEntity } from './entities/stock.entity';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,
    @InjectRepository(StockMovementEntity)
    private readonly movementRepository: Repository<StockMovementEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createStock(
    dto: CreateStockDto,
    principal: AuthPrincipal,
  ): Promise<StockEntity> {
    return this.stockRepository.save(
      this.stockRepository.create({
        ...dto,
        branchId: resolveBranchId(principal, dto.branchId),
      }),
    );
  }

  async findAllStocks(
    pagination: PaginationQueryDto,
    principal: AuthPrincipal,
  ): Promise<{
    data: StockEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.stockRepository.findAndCount({
      where:
        principal.roleName === RoleName.ADMIN
          ? undefined
          : { branchId: principal.branchId },
      relations: ['product', 'branch'],
      skip: (page - 1) * limit,
      take: limit,
      order: { stockId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOneStock(
    id: number,
    principal: AuthPrincipal,
  ): Promise<StockEntity> {
    const stock = await this.stockRepository.findOne({
      where: { stockId: id },
      relations: ['product', 'branch'],
    });
    if (!stock) throw new NotFoundException(`Stock #${id} not found`);
    assertBranchAccess(principal, stock.branchId);
    return stock;
  }

  async updateStock(
    id: number,
    dto: UpdateStockDto,
    principal: AuthPrincipal,
  ): Promise<StockEntity> {
    const stock = await this.findOneStock(id, principal);
    const branchId = resolveBranchId(principal, dto.branchId ?? stock.branchId);
    stock.branchId = branchId;
    if (dto.reorderLevel !== undefined) {
      stock.reorderLevel = dto.reorderLevel;
    }
    return this.stockRepository.save(stock);
  }

  async recordMovement(
    dto: CreateStockMovementDto,
    principal: AuthPrincipal,
  ): Promise<StockMovementEntity> {
    const branchId = resolveBranchId(principal, dto.branchId);
    const movementId = await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(StockEntity);
      let stock = await repository
        .createQueryBuilder('stock')
        .setLock('pessimistic_write')
        .where('stock.productId = :productId', { productId: dto.productId })
        .andWhere('stock.branchId = :branchId', { branchId })
        .getOne();
      if (!stock) {
        stock = repository.create({
          productId: dto.productId,
          branchId,
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
      } else {
        stock.quantity = dto.quantity;
      }
      await repository.save(stock);
      const movementRepository = manager.getRepository(StockMovementEntity);
      const movement = await movementRepository.save(
        movementRepository.create({
          ...dto,
          branchId,
          employeeId: principal.employeeId,
        }),
      );
      return movement.movementId;
    });
    const movement = await this.movementRepository.findOneBy({ movementId });
    if (!movement) throw new NotFoundException('Stock movement not found');
    return movement;
  }

  async findAllMovements(
    pagination: PaginationQueryDto,
    principal: AuthPrincipal,
  ): Promise<{
    data: StockMovementEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.movementRepository.findAndCount({
      where:
        principal.roleName === RoleName.ADMIN
          ? undefined
          : { branchId: principal.branchId },
      relations: ['product', 'branch', 'employee'],
      skip: (page - 1) * limit,
      take: limit,
      order: { movementId: 'DESC' },
    });
    return { data, total, page, limit };
  }
}

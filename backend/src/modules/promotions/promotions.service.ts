import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PromotionEntity } from './entities/promotion.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(PromotionEntity)
    private readonly promotionRepository: Repository<PromotionEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(dto: CreatePromotionDto): Promise<PromotionEntity> {
    let products: ProductEntity[] = [];
    if (dto.eligibleProductIds && dto.eligibleProductIds.length > 0) {
      products = await this.productRepository.findBy({
        productId: In(dto.eligibleProductIds),
      });
    }

    const promotion = this.promotionRepository.create({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      eligibleProducts: products,
    });

    return this.promotionRepository.save(promotion);
  }

  async findAll(pagination: PaginationQueryDto): Promise<{
    data: PromotionEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.promotionRepository.findAndCount({
      relations: ['eligibleProducts'],
      skip: (page - 1) * limit,
      take: limit,
      order: { promotionId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<PromotionEntity> {
    const promotion = await this.promotionRepository.findOne({
      where: { promotionId: id },
      relations: ['eligibleProducts'],
    });
    if (!promotion) {
      throw new NotFoundException(`Promotion #${id} not found`);
    }
    return promotion;
  }

  async update(id: number, dto: UpdatePromotionDto): Promise<PromotionEntity> {
    const promotion = await this.findOne(id);
    if (dto.eligibleProductIds) {
      promotion.eligibleProducts = await this.productRepository.findBy({
        productId: In(dto.eligibleProductIds),
      });
    }
    Object.assign(promotion, {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : promotion.startDate,
      endDate: dto.endDate ? new Date(dto.endDate) : promotion.endDate,
    });
    return this.promotionRepository.save(promotion);
  }

  async remove(id: number): Promise<void> {
    const promotion = await this.findOne(id);
    await this.promotionRepository.softRemove(promotion);
  }
}

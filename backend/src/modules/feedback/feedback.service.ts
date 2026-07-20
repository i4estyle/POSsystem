import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedbackEntity } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
  ) {}

  async create(dto: CreateFeedbackDto): Promise<FeedbackEntity> {
    if (dto.orderId) {
      const existing = await this.feedbackRepository.findOne({
        where: { orderId: dto.orderId },
      });
      if (existing) {
        throw new ConflictException('Feedback for this order already exists');
      }
    }
    const feedback = this.feedbackRepository.create(dto);
    return this.feedbackRepository.save(feedback);
  }

  async findAll(pagination: PaginationQueryDto): Promise<{
    data: FeedbackEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.feedbackRepository.findAndCount({
      relations: ['customer', 'order'],
      skip: (page - 1) * limit,
      take: limit,
      order: { feedbackId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<FeedbackEntity> {
    const feedback = await this.feedbackRepository.findOne({
      where: { feedbackId: id },
      relations: ['customer', 'order'],
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback #${id} not found`);
    }
    return feedback;
  }

  async update(id: number, dto: UpdateFeedbackDto): Promise<FeedbackEntity> {
    const feedback = await this.findOne(id);
    if (dto.orderId && dto.orderId !== feedback.orderId) {
      const existing = await this.feedbackRepository.findOne({
        where: { orderId: dto.orderId },
      });
      if (existing) {
        throw new ConflictException('Feedback for this order already exists');
      }
    }
    Object.assign(feedback, dto);
    return this.feedbackRepository.save(feedback);
  }

  async remove(id: number): Promise<void> {
    const feedback = await this.findOne(id);
    await this.feedbackRepository.softRemove(feedback);
  }
}

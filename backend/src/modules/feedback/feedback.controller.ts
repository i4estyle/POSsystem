import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { FeedbackEntity } from './entities/feedback.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างความคิดเห็น/รีวิวใหม่' })
  @ApiResponse({ status: 201, type: FeedbackEntity })
  async create(@Body() dto: CreateFeedbackDto): Promise<FeedbackEntity> {
    return this.feedbackService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการความคิดเห็นแบบแบ่งหน้า' })
  async findAll(@Query() pagination: PaginationQueryDto): Promise<{
    data: FeedbackEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.feedbackService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลความคิดเห็นตาม ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FeedbackEntity> {
    return this.feedbackService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขความคิดเห็น' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFeedbackDto,
  ): Promise<FeedbackEntity> {
    return this.feedbackService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'ลบความคิดเห็น (Soft Delete)' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.feedbackService.remove(id);
  }
}

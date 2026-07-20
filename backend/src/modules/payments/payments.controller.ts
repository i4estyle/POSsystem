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
import { PaymentsService } from './payments.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentMethodEntity } from './entities/payment-method.entity';
import { PaymentEntity } from './entities/payment.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('methods')
  @ApiOperation({ summary: 'สร้างช่องทางการชำระเงินใหม่' })
  @ApiResponse({ status: 201, type: PaymentMethodEntity })
  async createMethod(
    @Body() dto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    return this.paymentsService.createMethod(dto);
  }

  @Get('methods')
  @ApiOperation({ summary: 'ดึงรายการช่องทางการชำระเงินแบบแบ่งหน้า' })
  async findAllMethods(@Query() pagination: PaginationQueryDto): Promise<{
    data: PaymentMethodEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.paymentsService.findAllMethods(pagination);
  }

  @Get('methods/:id')
  @ApiOperation({ summary: 'ดึงข้อมูลช่องทางการชำระเงินตาม ID' })
  async findOneMethod(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaymentMethodEntity> {
    return this.paymentsService.findOneMethod(id);
  }

  @Patch('methods/:id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลช่องทางการชำระเงิน' })
  async updateMethod(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    return this.paymentsService.updateMethod(id, dto);
  }

  @Delete('methods/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'ลบช่องทางการชำระเงิน (Soft Delete)' })
  async removeMethod(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.paymentsService.removeMethod(id);
  }

  @Post()
  @ApiOperation({ summary: 'บันทึกการชำระเงิน' })
  @ApiResponse({ status: 201, type: PaymentEntity })
  async createPayment(@Body() dto: CreatePaymentDto): Promise<PaymentEntity> {
    return this.paymentsService.createPayment(dto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการประวัติการชำระเงินแบบแบ่งหน้า' })
  async findAllPayments(@Query() pagination: PaginationQueryDto): Promise<{
    data: PaymentEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.paymentsService.findAllPayments(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลประวัติการชำระเงินตาม ID' })
  async findOnePayment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaymentEntity> {
    return this.paymentsService.findOnePayment(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลการชำระเงิน' })
  async updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentDto,
  ): Promise<PaymentEntity> {
    return this.paymentsService.updatePayment(id, dto);
  }
}

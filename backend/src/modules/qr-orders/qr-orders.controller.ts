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
import { QrOrdersService } from './qr-orders.service';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { UpdateQrCodeDto } from './dto/update-qr-code.dto';
import { CreateTableSessionDto } from './dto/create-table-session.dto';
import { UpdateTableSessionDto } from './dto/update-table-session.dto';
import { CreateTableRequestDto } from './dto/create-table-request.dto';
import { UpdateTableRequestDto } from './dto/update-table-request.dto';
import { QrCodeEntity } from './entities/qr-code.entity';
import { TableSessionEntity } from './entities/table-session.entity';
import { TableRequestEntity } from './entities/table-request.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('QR Orders')
@Controller('qr-orders')
export class QrOrdersController {
  constructor(private readonly qrOrdersService: QrOrdersService) {}

  @Post('qr-codes')
  @ApiOperation({ summary: 'สร้าง QR Code ใหม่สำหรับโต๊ะ/Takeaway' })
  @ApiResponse({ status: 201, type: QrCodeEntity })
  async createQrCode(@Body() dto: CreateQrCodeDto): Promise<QrCodeEntity> {
    return this.qrOrdersService.createQrCode(dto);
  }

  @Get('qr-codes')
  @ApiOperation({ summary: 'ดึงรายการ QR Code ทั้งหมดแบบแบ่งหน้า' })
  async findAllQrCodes(@Query() pagination: PaginationQueryDto): Promise<{
    data: QrCodeEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.qrOrdersService.findAllQrCodes(pagination);
  }

  @Get('qr-codes/token/:token')
  @ApiOperation({ summary: 'ดึงข้อมูล QR Code จาก Token สแกน' })
  async findByToken(@Param('token') token: string): Promise<QrCodeEntity> {
    return this.qrOrdersService.findByToken(token);
  }

  @Get('qr-codes/:id')
  @ApiOperation({ summary: 'ดึงข้อมูล QR Code ตาม ID' })
  async findOneQrCode(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<QrCodeEntity> {
    return this.qrOrdersService.findOneQrCode(id);
  }

  @Patch('qr-codes/:id')
  @ApiOperation({ summary: 'แก้ไขข้อมูล QR Code' })
  async updateQrCode(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQrCodeDto,
  ): Promise<QrCodeEntity> {
    return this.qrOrdersService.updateQrCode(id, dto);
  }

  @Delete('qr-codes/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'ลบ QR Code (Soft Delete)' })
  async removeQrCode(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.qrOrdersService.removeQrCode(id);
  }

  @Post('sessions')
  @ApiOperation({ summary: 'เปิดเซสชันโต๊ะอาหารเมื่อสแกน QR Code' })
  @ApiResponse({ status: 201, type: TableSessionEntity })
  async createSession(
    @Body() dto: CreateTableSessionDto,
  ): Promise<TableSessionEntity> {
    return this.qrOrdersService.createSession(dto);
  }

  @Get('sessions')
  @ApiOperation({ summary: 'ดึงรายการเซสชันโต๊ะอาหารแบบแบ่งหน้า' })
  async findAllSessions(@Query() pagination: PaginationQueryDto): Promise<{
    data: TableSessionEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.qrOrdersService.findAllSessions(pagination);
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'ดึงข้อมูลเซสชันโต๊ะอาหารตาม ID' })
  async findOneSession(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TableSessionEntity> {
    return this.qrOrdersService.findOneSession(id);
  }

  @Patch('sessions/:id')
  @ApiOperation({ summary: 'อัปเดตสถานะเซสชันโต๊ะอาหาร (เช่น ปิดเซสชัน)' })
  async updateSession(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTableSessionDto,
  ): Promise<TableSessionEntity> {
    return this.qrOrdersService.updateSession(id, dto);
  }

  @Post('requests')
  @ApiOperation({
    summary: 'สร้างคำขอจากโต๊ะ (เช่น เรียกพนักงาน/ขอเช็คบิล/ขอน้ำ)',
  })
  @ApiResponse({ status: 201, type: TableRequestEntity })
  async createRequest(
    @Body() dto: CreateTableRequestDto,
  ): Promise<TableRequestEntity> {
    return this.qrOrdersService.createRequest(dto);
  }

  @Get('requests')
  @ApiOperation({ summary: 'ดึงรายการคำขอจากโต๊ะแบบแบ่งหน้า' })
  async findAllRequests(@Query() pagination: PaginationQueryDto): Promise<{
    data: TableRequestEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.qrOrdersService.findAllRequests(pagination);
  }

  @Get('requests/:id')
  @ApiOperation({ summary: 'ดึงข้อมูลคำขอจากโต๊ะตาม ID' })
  async findOneRequest(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TableRequestEntity> {
    return this.qrOrdersService.findOneRequest(id);
  }

  @Patch('requests/:id')
  @ApiOperation({
    summary: 'อัปเดตสถานะคำขอจากโต๊ะ (พนักงานรับเรื่อง/เสร็จสิ้น)',
  })
  async updateRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTableRequestDto,
  ): Promise<TableRequestEntity> {
    return this.qrOrdersService.updateRequest(id, dto);
  }
}

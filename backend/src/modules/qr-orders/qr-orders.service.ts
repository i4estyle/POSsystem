import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrCodeEntity } from './entities/qr-code.entity';
import { TableSessionEntity } from './entities/table-session.entity';
import { TableRequestEntity } from './entities/table-request.entity';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { UpdateQrCodeDto } from './dto/update-qr-code.dto';
import { CreateTableSessionDto } from './dto/create-table-session.dto';
import { UpdateTableSessionDto } from './dto/update-table-session.dto';
import { CreateTableRequestDto } from './dto/create-table-request.dto';
import { UpdateTableRequestDto } from './dto/update-table-request.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { RequestStatus, SessionStatus } from '../../common/enums';
import * as crypto from 'crypto';

@Injectable()
export class QrOrdersService {
  constructor(
    @InjectRepository(QrCodeEntity)
    private readonly qrRepository: Repository<QrCodeEntity>,
    @InjectRepository(TableSessionEntity)
    private readonly sessionRepository: Repository<TableSessionEntity>,
    @InjectRepository(TableRequestEntity)
    private readonly requestRepository: Repository<TableRequestEntity>,
  ) {}

  private generateToken(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  async createQrCode(dto: CreateQrCodeDto): Promise<QrCodeEntity> {
    const codeToken = dto.codeToken ?? this.generateToken();
    const qr = this.qrRepository.create({ ...dto, codeToken });
    return this.qrRepository.save(qr);
  }

  async findAllQrCodes(pagination: PaginationQueryDto): Promise<{
    data: QrCodeEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.qrRepository.findAndCount({
      relations: ['branch', 'table'],
      skip: (page - 1) * limit,
      take: limit,
      order: { qrCodeId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOneQrCode(id: number): Promise<QrCodeEntity> {
    const qr = await this.qrRepository.findOne({
      where: { qrCodeId: id },
      relations: ['branch', 'table'],
    });
    if (!qr) {
      throw new NotFoundException(`QR Code #${id} not found`);
    }
    return qr;
  }

  async findByToken(token: string): Promise<QrCodeEntity> {
    const qr = await this.qrRepository.findOne({
      where: { codeToken: token },
      relations: ['branch', 'table'],
    });
    if (!qr) {
      throw new NotFoundException(`QR Code with token '${token}' not found`);
    }
    return qr;
  }

  async updateQrCode(id: number, dto: UpdateQrCodeDto): Promise<QrCodeEntity> {
    const qr = await this.findOneQrCode(id);
    Object.assign(qr, dto);
    return this.qrRepository.save(qr);
  }

  async removeQrCode(id: number): Promise<void> {
    const qr = await this.findOneQrCode(id);
    await this.qrRepository.softRemove(qr);
  }

  async createSession(dto: CreateTableSessionDto): Promise<TableSessionEntity> {
    const session = this.sessionRepository.create({
      ...dto,
      startedAt: new Date(),
    });
    return this.sessionRepository.save(session);
  }

  async findAllSessions(pagination: PaginationQueryDto): Promise<{
    data: TableSessionEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.sessionRepository.findAndCount({
      relations: ['qrCode', 'table', 'customer'],
      skip: (page - 1) * limit,
      take: limit,
      order: { sessionId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOneSession(id: number): Promise<TableSessionEntity> {
    const session = await this.sessionRepository.findOne({
      where: { sessionId: id },
      relations: ['qrCode', 'table', 'customer'],
    });
    if (!session) {
      throw new NotFoundException(`Table Session #${id} not found`);
    }
    return session;
  }

  async updateSession(
    id: number,
    dto: UpdateTableSessionDto,
  ): Promise<TableSessionEntity> {
    const session = await this.findOneSession(id);
    if (
      dto.sessionStatus === SessionStatus.CLOSED &&
      session.sessionStatus !== SessionStatus.CLOSED
    ) {
      session.endedAt = new Date();
    }
    Object.assign(session, dto);
    return this.sessionRepository.save(session);
  }

  async createRequest(dto: CreateTableRequestDto): Promise<TableRequestEntity> {
    const request = this.requestRepository.create(dto);
    return this.requestRepository.save(request);
  }

  async findAllRequests(pagination: PaginationQueryDto): Promise<{
    data: TableRequestEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.requestRepository.findAndCount({
      relations: ['session', 'table', 'handledByEmployee'],
      skip: (page - 1) * limit,
      take: limit,
      order: { requestId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOneRequest(id: number): Promise<TableRequestEntity> {
    const request = await this.requestRepository.findOne({
      where: { requestId: id },
      relations: ['session', 'table', 'handledByEmployee'],
    });
    if (!request) {
      throw new NotFoundException(`Table Request #${id} not found`);
    }
    return request;
  }

  async updateRequest(
    id: number,
    dto: UpdateTableRequestDto,
  ): Promise<TableRequestEntity> {
    const request = await this.findOneRequest(id);
    if (
      dto.status === RequestStatus.DONE &&
      request.status !== RequestStatus.DONE
    ) {
      request.resolvedAt = new Date();
    }
    Object.assign(request, dto);
    return this.requestRepository.save(request);
  }
}

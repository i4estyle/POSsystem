import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceEntity } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceEntity)
    private readonly attendanceRepository: Repository<AttendanceEntity>,
  ) {}

  async create(dto: CreateAttendanceDto): Promise<AttendanceEntity> {
    const attendance = this.attendanceRepository.create(dto);
    return this.attendanceRepository.save(attendance);
  }

  async findAll(pagination: PaginationQueryDto): Promise<{
    data: AttendanceEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [data, total] = await this.attendanceRepository.findAndCount({
      relations: ['employee'],
      skip: (page - 1) * limit,
      take: limit,
      order: { attendanceId: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<AttendanceEntity> {
    const attendance = await this.attendanceRepository.findOne({
      where: { attendanceId: id },
      relations: ['employee'],
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance #${id} not found`);
    }
    return attendance;
  }

  async update(
    id: number,
    dto: UpdateAttendanceDto,
  ): Promise<AttendanceEntity> {
    const attendance = await this.findOne(id);
    Object.assign(attendance, dto);
    return this.attendanceRepository.save(attendance);
  }

  async remove(id: number): Promise<void> {
    const attendance = await this.findOne(id);
    await this.attendanceRepository.softRemove(attendance);
  }
}

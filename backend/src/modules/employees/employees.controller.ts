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
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeEntity } from './entities/employee.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleName } from '../../common/enums';
import type { AuthPrincipal } from '../../common/interfaces/auth-principal.interface';

@ApiTags('Employees')
@Controller('employees')
@Roles(RoleName.ADMIN, RoleName.MANAGER)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างพนักงานใหม่' })
  @ApiResponse({ status: 201, type: EmployeeEntity })
  async create(
    @Body() dto: CreateEmployeeDto,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<EmployeeEntity> {
    return this.employeesService.create(dto, principal);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการพนักงานแบบแบ่งหน้า' })
  async findAll(
    @Query() pagination: PaginationQueryDto,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<{
    data: EmployeeEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.employeesService.findAll(pagination, principal);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลพนักงานตาม ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<EmployeeEntity> {
    return this.employeesService.findOne(id, principal);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลพนักงาน' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDto,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<EmployeeEntity> {
    return this.employeesService.update(id, dto, principal);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'ลบพนักงาน (Soft Delete)' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<void> {
    return this.employeesService.remove(id, principal);
  }
}

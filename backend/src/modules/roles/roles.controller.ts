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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleName } from '../../common/enums';

@ApiTags('Roles')
@Controller('roles')
@Roles(RoleName.ADMIN, RoleName.MANAGER)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'สร้างตำแหน่งใหม่' })
  @ApiResponse({ status: 201, type: RoleEntity })
  async create(@Body() dto: CreateRoleDto): Promise<RoleEntity> {
    return this.rolesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการตำแหน่งแบบแบ่งหน้า' })
  async findAll(@Query() pagination: PaginationQueryDto): Promise<{
    data: RoleEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.rolesService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลตำแหน่งตาม ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RoleEntity> {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'แก้ไขข้อมูลตำแหน่ง' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ): Promise<RoleEntity> {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'ลบตำแหน่ง (Soft Delete)' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.rolesService.remove(id);
  }
}

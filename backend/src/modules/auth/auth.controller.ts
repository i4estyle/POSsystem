import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleName } from '../../common/enums';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import type { AuthPrincipal } from '../../common/interfaces/auth-principal.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'เข้าสู่ระบบสำหรับพนักงาน' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Post('register')
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'ลงทะเบียนพนักงานใหม่' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  async register(
    @Body() dto: RegisterDto,
    @AuthUser() principal: AuthPrincipal,
  ): Promise<AuthResponseDto> {
    return this.authService.register(dto, principal);
  }

  @Post('check-availability')
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'ตรวจสอบความพร้อมใช้งานของ username, email, nationalId',
  })
  async checkAvailability(
    @Body() dto: { field: 'username' | 'email' | 'nationalId'; value: string },
  ): Promise<{ available: boolean; message?: string }> {
    return this.authService.checkAvailability(dto.field, dto.value);
  }
}

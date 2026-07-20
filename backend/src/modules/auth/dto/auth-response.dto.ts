import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty()
  employeeId: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  branchId: number;

  @ApiProperty({ required: false })
  branchName?: string;

  @ApiProperty()
  roleId: number;

  @ApiProperty()
  nationalId?: string;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  titlePrefix?: string;

  @ApiProperty()
  profileImage?: string;

  @ApiProperty()
  status: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}

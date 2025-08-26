import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty()
  role: string;
}

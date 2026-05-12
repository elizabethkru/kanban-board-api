import { ApiProperty } from '@nestjs/swagger';

export class BoardResponseDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
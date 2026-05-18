import { ApiProperty } from '@nestjs/swagger';

export class CardResponseDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  columnId: string;

  @ApiProperty()
  position: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min } from 'class-validator';

export class MoveCardDto {
  @ApiProperty()
  @IsUUID()
  targetColumnId: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  newPosition: number;
}

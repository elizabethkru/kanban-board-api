import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  title: string;

  @ApiProperty()
  @IsUUID()
  boardId: string;
}

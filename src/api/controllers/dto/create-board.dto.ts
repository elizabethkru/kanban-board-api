import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ example: 'Мои задачи', description: 'Название доски' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title: string;
}
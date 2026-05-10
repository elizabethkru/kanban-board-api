import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';


export class UpdateBoardDto {
  @ApiProperty({ example: 'Новое название доски' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title: string;
}
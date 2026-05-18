import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateCardDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

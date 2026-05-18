import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, MaxLength } from 'class-validator';

export class CreateCardDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsUUID()
  columnId: string;
}

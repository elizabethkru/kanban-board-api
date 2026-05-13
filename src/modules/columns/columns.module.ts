import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';

@Module({
  providers: [ColumnsService],
})
export class ColumnsModule {}

import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardSchema } from './infrastructure/schemas/board.schema';
import { BoardRepository } from './infrastructure/repository/board.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BoardSchema])],
  providers: [BoardRepository],
  exports: [BoardRepository],
})
export class BoardsModule {}

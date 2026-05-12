import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardSchema } from './infrastructure/schemas/board.schema';
import { TypeOrmBoardRepository } from './infrastructure/repository/board.repository';
import { commandHandlers } from './application/command';
import { CqrsModule } from '@nestjs/cqrs';


export const BOARD_REPOSITORY_TOKEN = 'BOARD_REPOSITORY';

@Module({
  imports: [TypeOrmModule.forFeature([BoardSchema]), CqrsModule],
  providers: [
    TypeOrmBoardRepository,
    ...commandHandlers,
  ],
  exports: [TypeOrmBoardRepository],
})
export class BoardsModule {}

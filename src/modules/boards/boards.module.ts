import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardSchema } from './infrastructure/schemas/board.schema';
import { TypeOrmBoardRepository } from './infrastructure/repository/board.repository';
import { commandHandlers } from './application/command';
import { CqrsModule } from '@nestjs/cqrs';
import { BoardOwnerGuard } from 'src/common/guards/board-owner.guard';
import { queryHandlers } from './application/queries';


export const BOARD_REPOSITORY_TOKEN = 'BOARD_REPOSITORY';

@Module({
  imports: [TypeOrmModule.forFeature([BoardSchema]), CqrsModule],
  providers: [
    BoardOwnerGuard,
    TypeOrmBoardRepository,
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports: [TypeOrmBoardRepository, BoardOwnerGuard],
})
export class BoardsModule {}

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmColumnRepository } from './infrastructure/repository/typeorm-column.repository';

import { BoardsModule } from '../boards/boards.module';
import { commandHandlers } from './application/command';
import { queryHandlers } from './application/queries';
import { ColumnSchema } from './infrastructure/schemas/columns.schema';
import { CardsModule } from '../cards/cards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ColumnSchema]),
    CqrsModule,
    BoardsModule,
    forwardRef(() => CardsModule),
  ],
  providers: [TypeOrmColumnRepository, ...commandHandlers, ...queryHandlers],
  exports: [TypeOrmColumnRepository],
})
export class ColumnsModule {}

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmCardRepository } from './infrastructure/repository/typeorm-card.repository';
import { GetCardHandler } from './application/queries/get-card/get-card.handler';
import { ColumnsModule } from '../columns/columns.module';
import { BoardsModule } from '../boards/boards.module';
import { CreateCardHandler } from './application/command/create-card/create-card.handler';
import { UpdateCardHandler } from './application/command/update-card/update-card.handler';
import { DeleteCardHandler } from './application/command/delete-card/delete-card.handler';
import { MoveCardHandler } from './application/command/move-card/move-card.handler';
import { GetCardsByColumnHandler } from './application/queries/get-card-by-column/get-cards-by-column.handler';
import { CardSchema } from './infrastructure/schemas/cards.schema';
import { CardOwnerGuard } from 'src/common/guards/card-owner.guard';
import { WebSocketModule } from '../websocket/websocket.module';

const commandHandlers = [
  CreateCardHandler,
  UpdateCardHandler,
  DeleteCardHandler,
  MoveCardHandler,
];
const queryHandlers = [GetCardsByColumnHandler, GetCardHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([CardSchema]),
    CqrsModule,
    forwardRef(() => ColumnsModule),
    BoardsModule,
    WebSocketModule,
  ],
  providers: [
    TypeOrmCardRepository,
    CardOwnerGuard,
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports: [TypeOrmCardRepository, CardOwnerGuard],
})
export class CardsModule {}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetCardQuery } from './get-card.query';
import { TypeOrmCardRepository } from '../../../infrastructure/repository/typeorm-card.repository';
import { TypeOrmColumnRepository } from '../../../../columns/infrastructure/repository/typeorm-column.repository';
import { TypeOrmBoardRepository } from '../../../../boards/infrastructure/repository/board.repository';
import { CardUuid } from '../../../domain/value-objects/card-uuid.vo';
import { ColumnUuid } from '../../../../columns/domain/value-objects/column-uuid.vo';
import { BoardUuid } from '../../../../boards/domain/value-objects/board-uuid.vo';

@QueryHandler(GetCardQuery)
export class GetCardHandler implements IQueryHandler<GetCardQuery> {
  constructor(
    private readonly cardRepository: TypeOrmCardRepository,
    private readonly columnRepository: TypeOrmColumnRepository,
    private readonly boardRepository: TypeOrmBoardRepository,
  ) {}

  async execute(query: GetCardQuery): Promise<any> {
    const card = await this.cardRepository.findById(
      CardUuid.fromString(query.cardId),
    );
    if (!card) throw new NotFoundException('Card not found');

    const column = await this.columnRepository.findById(
      ColumnUuid.fromString(card.columnId),
    );
    if (!column) throw new NotFoundException('Column not found');

    const board = await this.boardRepository.findById(
      BoardUuid.fromString(column.boardId),
    );
    if (!board) throw new NotFoundException('Board not found');
    if (board.userId !== query.userId) throw new ForbiddenException();

    return {
      uuid: card.uuid.toString(),
      title: card.title.getValue(),
      description: card.description.getValue(),
      columnId: card.columnId,
      position: card.position.getValue(),
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    };
  }
}

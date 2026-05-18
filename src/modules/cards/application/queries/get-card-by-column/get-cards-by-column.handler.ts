import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetCardsByColumnQuery } from './get-cards-by-column.query';
import { TypeOrmCardRepository } from '../../../infrastructure/repository/typeorm-card.repository';
import { TypeOrmColumnRepository } from '../../../../columns/infrastructure/repository/typeorm-column.repository';
import { TypeOrmBoardRepository } from '../../../../boards/infrastructure/repository/board.repository';
import { ColumnUuid } from '../../../../columns/domain/value-objects/column-uuid.vo';
import { BoardUuid } from '../../../../boards/domain/value-objects/board-uuid.vo';

@QueryHandler(GetCardsByColumnQuery)
export class GetCardsByColumnHandler implements IQueryHandler<GetCardsByColumnQuery> {
  constructor(
    private readonly cardRepository: TypeOrmCardRepository,
    private readonly columnRepository: TypeOrmColumnRepository,
    private readonly boardRepository: TypeOrmBoardRepository,
  ) {}

  async execute(query: GetCardsByColumnQuery): Promise<any[]> {
    const column = await this.columnRepository.findById(
      ColumnUuid.fromString(query.columnId),
    );
    if (!column) throw new NotFoundException('Column not found');

    const board = await this.boardRepository.findById(
      BoardUuid.fromString(column.boardId),
    );
    if (!board) throw new NotFoundException('Board not found');
    if (board.userId !== query.userId) throw new ForbiddenException();

    const cards = await this.cardRepository.findByColumnId(query.columnId);
    return cards.map((card) => ({
      uuid: card.uuid.toString(),
      title: card.title.getValue(),
      description: card.description.getValue(),
      columnId: card.columnId,
      position: card.position.getValue(),
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    }));
  }
}

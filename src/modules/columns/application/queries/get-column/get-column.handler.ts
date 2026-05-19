// src/modules/columns/application/queries/get-column/get-column.handler.ts

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetColumnQuery } from './get-column.query';
import { TypeOrmColumnRepository } from '../../../infrastructure/repository/typeorm-column.repository';
import { TypeOrmBoardRepository } from '../../../../boards/infrastructure/repository/board.repository';
import { TypeOrmCardRepository } from '../../../../cards/infrastructure/repository/typeorm-card.repository';
import { ColumnUuid } from '../../../domain/value-objects/column-uuid.vo';
import { BoardUuid } from '../../../../boards/domain/value-objects/board-uuid.vo';

interface ColumnWithCardsResponse {
  uuid: string;
  title: string;
  boardId: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  cards: {
    uuid: string;
    title: string;
    description: string | null;
    columnId: string;
    position: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

@QueryHandler(GetColumnQuery)
export class GetColumnHandler implements IQueryHandler<GetColumnQuery> {
  constructor(
    private readonly columnRepository: TypeOrmColumnRepository,
    private readonly boardRepository: TypeOrmBoardRepository,
    private readonly cardRepository: TypeOrmCardRepository,
  ) {}

  async execute(query: GetColumnQuery): Promise<ColumnWithCardsResponse> {
    const columnId = ColumnUuid.fromString(query.columnId);
    const column = await this.columnRepository.findById(columnId);
    if (!column) throw new NotFoundException('Column not found');

    const board = await this.boardRepository.findById(
      BoardUuid.fromString(column.boardId),
    );
    if (!board) throw new NotFoundException('Board not found');
    if (board.userId !== query.userId)
      throw new ForbiddenException('You do not own this board');

    const cards = await this.cardRepository.findByColumnId(
      column.uuid.toString(),
    );

    return {
      uuid: column.uuid.toString(),
      title: column.title.getValue(),
      boardId: column.boardId,
      position: column.position.getValue(),
      createdAt: column.createdAt,
      updatedAt: column.updatedAt,
      cards: cards.map((card) => ({
        uuid: card.uuid.toString(),
        title: card.title.getValue(),
        description: card.description.getValue(),
        columnId: card.columnId,
        position: card.position.getValue(),
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
      })),
    };
  }
}

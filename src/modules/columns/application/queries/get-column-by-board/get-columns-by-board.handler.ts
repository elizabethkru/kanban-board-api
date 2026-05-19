// src/modules/columns/application/queries/get-columns-by-board/get-columns-by-board.handler.ts

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetColumnsByBoardQuery } from './get-columns-by-board.query';
import { TypeOrmColumnRepository } from '../../../infrastructure/repository/typeorm-column.repository';
import { TypeOrmBoardRepository } from '../../../../boards/infrastructure/repository/board.repository';
import { TypeOrmCardRepository } from '../../../../cards/infrastructure/repository/typeorm-card.repository';
import { BoardUuid } from '../../../../boards/domain/value-objects/board-uuid.vo';

// Описываем тип ответа: колонка с массивом карточек
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

@QueryHandler(GetColumnsByBoardQuery)
export class GetColumnsByBoardHandler implements IQueryHandler<GetColumnsByBoardQuery> {
  constructor(
    private readonly columnRepository: TypeOrmColumnRepository,
    private readonly boardRepository: TypeOrmBoardRepository,
    private readonly cardRepository: TypeOrmCardRepository,
  ) {}

  async execute(
    query: GetColumnsByBoardQuery,
  ): Promise<ColumnWithCardsResponse[]> {
    const board = await this.boardRepository.findById(
      BoardUuid.fromString(query.boardId),
    );
    if (!board || board.userId !== query.userId) {
      throw new NotFoundException('Board not found');
    }
    const columns = await this.columnRepository.findByBoardId(query.boardId);
    const result: ColumnWithCardsResponse[] = []; // Явная типизация
    for (const col of columns) {
      const cards = await this.cardRepository.findByColumnId(
        col.uuid.toString(),
      );
      result.push({
        uuid: col.uuid.toString(),
        title: col.title.getValue(),
        boardId: col.boardId,
        position: col.position.getValue(),
        createdAt: col.createdAt,
        updatedAt: col.updatedAt,
        cards: cards.map((card) => ({
          uuid: card.uuid.toString(),
          title: card.title.getValue(),
          description: card.description.getValue(),
          columnId: card.columnId,
          position: card.position.getValue(),
          createdAt: card.createdAt,
          updatedAt: card.updatedAt,
        })),
      });
    }
    return result;
  }
}

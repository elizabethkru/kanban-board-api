import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetColumnQuery } from './get-column.query';
import { TypeOrmColumnRepository } from '../../../infrastructure/repository/typeorm-column.repository';
import { TypeOrmBoardRepository } from '../../../../boards/infrastructure/repository/board.repository';
import { ColumnUuid } from '../../../domain/value-objects/column-uuid.vo';
import { BoardUuid } from '../../../../boards/domain/value-objects/board-uuid.vo';

@QueryHandler(GetColumnQuery)
export class GetColumnHandler implements IQueryHandler<GetColumnQuery> {
  constructor(
    private readonly columnRepository: TypeOrmColumnRepository,
    private readonly boardRepository: TypeOrmBoardRepository,
  ) {}

  async execute(query: GetColumnQuery): Promise<any> {
    const columnId = ColumnUuid.fromString(query.columnId);
    const column = await this.columnRepository.findById(columnId);
    if (!column) throw new NotFoundException('Column not found');

    const board = await this.boardRepository.findById(
      BoardUuid.fromString(column.boardId),
    );
    if (!board) throw new NotFoundException('Board not found');
    if (board.userId !== query.userId)
      throw new ForbiddenException('You do not own this board');

    return {
      uuid: column.uuid.toString(),
      title: column.title.getValue(),
      boardId: column.boardId,
      position: column.position.getValue(),
      createdAt: column.createdAt,
      updatedAt: column.updatedAt,
    };
  }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetColumnsByBoardQuery } from './get-columns-by-board.query';
import { TypeOrmColumnRepository } from '../../../infrastructure/repository/typeorm-column.repository';
import { TypeOrmBoardRepository } from '../../../../boards/infrastructure/repository/board.repository';
import { BoardUuid } from '../../../../boards/domain/value-objects/board-uuid.vo';

@QueryHandler(GetColumnsByBoardQuery)
export class GetColumnsByBoardHandler implements IQueryHandler<GetColumnsByBoardQuery> {
  constructor(
    private readonly columnRepository: TypeOrmColumnRepository,
    private readonly boardRepository: TypeOrmBoardRepository,
  ) {}

  async execute(query: GetColumnsByBoardQuery): Promise<any[]> {
    const board = await this.boardRepository.findById(
      BoardUuid.fromString(query.boardId),
    );
    if (!board || board.userId !== query.userId)
      throw new NotFoundException('Board not found');
    const columns = await this.columnRepository.findByBoardId(query.boardId);
    return columns.map((col) => ({
      uuid: col.uuid.toString(),
      title: col.title.getValue(),
      boardId: col.boardId,
      position: col.position.getValue(),
      createdAt: col.createdAt,
      updatedAt: col.updatedAt,
    }));
  }
}

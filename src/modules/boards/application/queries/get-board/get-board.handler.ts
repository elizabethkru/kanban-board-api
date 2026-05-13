import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { GetBoardQuery } from './get-board.query';
import { BoardUuid } from 'src/modules/boards/domain/value-objects/board-uuid.vo';
import { TypeOrmBoardRepository } from 'src/modules/boards/infrastructure/repository/board.repository';


@QueryHandler(GetBoardQuery)
export class GetBoardHandler implements IQueryHandler<GetBoardQuery> {
  constructor(private readonly boardRepository: TypeOrmBoardRepository) {}

  async execute(query: GetBoardQuery) {
    const boardId = BoardUuid.fromString(query.boardId);
    const board = await this.boardRepository.findById(boardId);
    if (!board) throw new NotFoundException('Board not found');
    if (board.userId !== query.userId) throw new NotFoundException('Board not found'); // безопасность

    return {
      uuid: board.uuid.toString(),
      title: board.title.getTitle(),
      userId: board.userId,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    };
  }
}
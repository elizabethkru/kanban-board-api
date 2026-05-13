import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBoardsQuery } from './get-boards.query';
import { TypeOrmBoardRepository } from '../../../infrastructure/repository/board.repository';
import { BoardResponseDto } from 'src/api/controllers/output/create-board.output';

@QueryHandler(GetBoardsQuery)
export class GetBoardsHandler implements IQueryHandler<GetBoardsQuery> {
  constructor(private readonly boardRepository: TypeOrmBoardRepository) {}

  async execute(query: GetBoardsQuery): Promise<BoardResponseDto[]> {
    const boards = await this.boardRepository.findAllByUserId(query.userId);
    return boards.map(board => ({
      uuid: board.uuid.toString(),
      title: board.title.getTitle(),
      userId: board.userId,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    }));
  }
}
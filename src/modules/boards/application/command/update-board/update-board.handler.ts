import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateBoardCommand } from './update-board.command';
import { TypeOrmBoardRepository } from '../../../infrastructure/repository/board.repository';
import { BoardUuid } from '../../../domain/value-objects/board-uuid.vo';
import { BoardTitle } from '../../../domain/value-objects/board-title.vo';

@CommandHandler(UpdateBoardCommand)
export class UpdateBoardHandler implements ICommandHandler<UpdateBoardCommand> {
  constructor(private readonly boardRepository: TypeOrmBoardRepository) {}

  async execute(command: UpdateBoardCommand): Promise<any> {
    const boardId = BoardUuid.fromString(command.data.id);
    const board = await this.boardRepository.findById(boardId);
    if (!board) throw new NotFoundException('Board not found');
    if (board.userId !== command.data.userId) throw new ForbiddenException('You do not own this board');

    const newTitle = new BoardTitle(command.data.title);
    board.changeTitle(newTitle);
    await this.boardRepository.update(board); // используем новый метод update

    return {
      uuid: board.uuid.toString(),
      title: board.title.getTitle(),
      userId: board.userId,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    };
  }
}
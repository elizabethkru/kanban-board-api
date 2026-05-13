import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { DeleteBoardCommand } from "./delete-board.command";
import { IBoardRepository } from "src/modules/boards/ports/board.repository.interface";
import { TypeOrmBoardRepository } from "src/modules/boards/infrastructure/repository/board.repository";
import { BoardUuid } from "src/modules/boards/domain/value-objects/board-uuid.vo";
import { ForbiddenException, NotFoundException } from "@nestjs/common";


@CommandHandler(DeleteBoardCommand)
export class DeleteBoardHandler implements ICommandHandler<DeleteBoardCommand> {
  constructor(private readonly boardRepository: TypeOrmBoardRepository) {}

  async execute(command: DeleteBoardCommand): Promise<void> {
    const boardId = BoardUuid.fromString(command.data.boardUuid);
    const board = await this.boardRepository.findById(boardId);
    if (!board) throw new NotFoundException('Board not found');
    if (board.userId !== command.data.userId) throw new ForbiddenException('You do not own this board');
    await this.boardRepository.delete(boardId);
  }
}
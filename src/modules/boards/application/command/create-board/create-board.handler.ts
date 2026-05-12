import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { CreateBoardCommand } from "./create-board.command";
import { BoardTitle } from "src/modules/boards/domain/value-objects/board-title.vo";
import { BoardAggregate } from "src/modules/boards/domain/board.aggregate";
import { Inject } from "@nestjs/common";
import type { IBoardRepository } from "src/modules/boards/ports/board.repository.interface";


@CommandHandler(CreateBoardCommand)
export class CreateBoardHandler implements ICommandHandler<CreateBoardCommand> {
  constructor(
       private readonly repository: IBoardRepository,
      private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateBoardCommand): Promise<any> {
    const title = new BoardTitle(command.data.title);
    const board = BoardAggregate.create(title, command.data.userId);
    const savedboard = await this.repository.save(board);
    this.eventPublisher.mergeObjectContext(savedboard);

    return {
      uuid: board.uuid.toString(),
      title: board.title.getTitle(),
      userId: board.userId,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    };
  }
}
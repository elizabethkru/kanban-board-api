import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateColumnCommand } from './update-column.command';
import { TypeOrmColumnRepository } from '../../../infrastructure/repository/typeorm-column.repository';
import { ColumnUuid } from '../../../domain/value-objects/column-uuid.vo';
import { BoardUuid } from 'src/modules/boards/domain/value-objects/board-uuid.vo';
import { ColumnTitle } from 'src/modules/columns/domain/value-objects/colunm-title.vo';
import { TypeOrmBoardRepository } from 'src/modules/boards/infrastructure/repository/board.repository';

@CommandHandler(UpdateColumnCommand)
export class UpdateColumnHandler implements ICommandHandler<UpdateColumnCommand> {
  constructor(
    private readonly columnRepository: TypeOrmColumnRepository,
    private readonly boardRepository: TypeOrmBoardRepository,
  ) {}

  async execute(command: UpdateColumnCommand): Promise<any> {
    const columnId = ColumnUuid.fromString(command.columnId);
    const column = await this.columnRepository.findById(columnId);
    if (!column) throw new NotFoundException('Column not found');
    // Проверка прав: нужно убедиться, что пользователь владеет доской.
    // Лучше в Guard, но можно и здесь:
    const board = await this.boardRepository.findById(
      BoardUuid.fromString(column.boardId),
    );
    if (board?.userId !== command.userId) throw new ForbiddenException();

    const newTitle = ColumnTitle.create(command.title);
    column.changeTitle(newTitle);
    await this.columnRepository.update(column);

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

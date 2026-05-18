import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateColumnCommand } from './create-column.command';
import { TypeOrmColumnRepository } from '../../../infrastructure/repository/typeorm-column.repository';
import { TypeOrmBoardRepository } from '../../../../boards/infrastructure/repository/board.repository';
import { ColumnPosition } from '../../../domain/value-objects/column-position.vo';
import { ColumnAggregate } from '../../../domain/column.aggregate';
import { BoardUuid } from '../../../../boards/domain/value-objects/board-uuid.vo';
import { ColumnTitle } from 'src/modules/columns/domain/value-objects/colunm-title.vo';

@CommandHandler(CreateColumnCommand)
export class CreateColumnHandler implements ICommandHandler<CreateColumnCommand> {
  constructor(
    private readonly columnRepository: TypeOrmColumnRepository,
    private readonly boardRepository: TypeOrmBoardRepository,
  ) {}

  async execute(command: CreateColumnCommand): Promise<any> {
    const board = await this.boardRepository.findById(
      BoardUuid.fromString(command.boardId),
    );
    if (!board) throw new NotFoundException('Board not found');
    if (board.userId !== command.userId)
      throw new ForbiddenException('You do not own this board');

    const maxPos = await this.columnRepository.getMaxPosition(command.boardId);
    const position = ColumnPosition.create(maxPos + 1);
    const title = ColumnTitle.create(command.title);
    const column = ColumnAggregate.create(title, command.boardId, position);
    await this.columnRepository.save(column);

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

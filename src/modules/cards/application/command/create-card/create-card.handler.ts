import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateCardCommand } from './create-card.command';
import { TypeOrmCardRepository } from '../../../infrastructure/repository/typeorm-card.repository';
import { TypeOrmColumnRepository } from '../../../../columns/infrastructure/repository/typeorm-column.repository';
import { TypeOrmBoardRepository } from '../../../../boards/infrastructure/repository/board.repository';
import { CardTitle } from '../../../domain/value-objects/card-title.vo';
import { CardDescription } from '../../../domain/value-objects/card-description.vo';
import { CardPosition } from '../../../domain/value-objects/card-position.vo';
import { CardAggregate } from '../../../domain/card.aggregate';
import { ColumnUuid } from '../../../../columns/domain/value-objects/column-uuid.vo';
import { BoardUuid } from '../../../../boards/domain/value-objects/board-uuid.vo';

@CommandHandler(CreateCardCommand)
export class CreateCardHandler implements ICommandHandler<CreateCardCommand> {
  constructor(
    private readonly cardRepository: TypeOrmCardRepository,
    private readonly columnRepository: TypeOrmColumnRepository,
    private readonly boardRepository: TypeOrmBoardRepository,
  ) {}

  async execute(command: CreateCardCommand): Promise<any> {
    const column = await this.columnRepository.findById(
      ColumnUuid.fromString(command.columnId),
    );
    if (!column) throw new NotFoundException('Column not found');

    const board = await this.boardRepository.findById(
      BoardUuid.fromString(column.boardId),
    );
    if (!board) throw new NotFoundException('Board not found');
    if (board.userId !== command.userId)
      throw new ForbiddenException('You do not own this board');

    const maxPos = await this.cardRepository.getMaxPosition(command.columnId);
    const position = CardPosition.create(maxPos + 1);
    const title = CardTitle.create(command.title);
    const description = command.description
      ? CardDescription.create(command.description)
      : CardDescription.create();
    const card = CardAggregate.create(
      title,
      command.columnId,
      position,
      description,
    );
    await this.cardRepository.save(card);

    return {
      uuid: card.uuid.toString(),
      title: card.title.getValue(),
      description: card.description.getValue(),
      columnId: card.columnId,
      position: card.position.getValue(),
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    };
  }
}

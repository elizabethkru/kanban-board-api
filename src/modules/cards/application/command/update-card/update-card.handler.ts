import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateCardCommand } from './update-card.command';
import { TypeOrmCardRepository } from '../../../infrastructure/repository/typeorm-card.repository';
import { TypeOrmColumnRepository } from '../../../../columns/infrastructure/repository/typeorm-column.repository';
import { TypeOrmBoardRepository } from '../../../../boards/infrastructure/repository/board.repository';
import { CardUuid } from '../../../domain/value-objects/card-uuid.vo';
import { CardTitle } from '../../../domain/value-objects/card-title.vo';
import { CardDescription } from '../../../domain/value-objects/card-description.vo';
import { ColumnUuid } from '../../../../columns/domain/value-objects/column-uuid.vo';
import { BoardUuid } from '../../../../boards/domain/value-objects/board-uuid.vo';

@CommandHandler(UpdateCardCommand)
export class UpdateCardHandler implements ICommandHandler<UpdateCardCommand> {
  constructor(
    private readonly cardRepository: TypeOrmCardRepository,
    private readonly columnRepository: TypeOrmColumnRepository,
    private readonly boardRepository: TypeOrmBoardRepository,
  ) {}

  async execute(command: UpdateCardCommand): Promise<any> {
    const card = await this.cardRepository.findById(
      CardUuid.fromString(command.cardId),
    );
    if (!card) throw new NotFoundException('Card not found');

    const column = await this.columnRepository.findById(
      ColumnUuid.fromString(card.columnId),
    );
    if (!column) throw new NotFoundException('Column not found');

    const board = await this.boardRepository.findById(
      BoardUuid.fromString(column.boardId),
    );
    if (!board) throw new NotFoundException('Board not found');
    if (board.userId !== command.userId)
      throw new ForbiddenException('You do not own this board');

    if (command.title) {
      const newTitle = CardTitle.create(command.title);
      card.changeTitle(newTitle);
    }
    if (command.description !== undefined) {
      const newDescription = CardDescription.create(command.description);
      card.changeDescription(newDescription);
    }

    await this.cardRepository.update(card);

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

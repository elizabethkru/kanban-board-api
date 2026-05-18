import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteCardCommand } from './delete-card.command';
import { TypeOrmCardRepository } from '../../../infrastructure/repository/typeorm-card.repository';
import { TypeOrmColumnRepository } from '../../../../columns/infrastructure/repository/typeorm-column.repository';
import { TypeOrmBoardRepository } from '../../../../boards/infrastructure/repository/board.repository';
import { CardUuid } from '../../../domain/value-objects/card-uuid.vo';
import { ColumnUuid } from '../../../../columns/domain/value-objects/column-uuid.vo';
import { BoardUuid } from '../../../../boards/domain/value-objects/board-uuid.vo';

@CommandHandler(DeleteCardCommand)
export class DeleteCardHandler implements ICommandHandler<DeleteCardCommand> {
  constructor(
    private readonly cardRepository: TypeOrmCardRepository,
    private readonly columnRepository: TypeOrmColumnRepository,
    private readonly boardRepository: TypeOrmBoardRepository,
  ) {}

  async execute(command: DeleteCardCommand): Promise<void> {
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

    await this.cardRepository.delete(CardUuid.fromString(command.cardId));
  }
}

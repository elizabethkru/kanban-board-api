import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { MoveCardCommand } from './move-card.command';
import { TypeOrmCardRepository } from '../../../infrastructure/repository/typeorm-card.repository';
import { TypeOrmColumnRepository } from '../../../../columns/infrastructure/repository/typeorm-column.repository';
import { TypeOrmBoardRepository } from '../../../../boards/infrastructure/repository/board.repository';
import { CardUuid } from '../../../domain/value-objects/card-uuid.vo';
import { ColumnUuid } from '../../../../columns/domain/value-objects/column-uuid.vo';
import { BoardUuid } from '../../../../boards/domain/value-objects/board-uuid.vo';
import { MoreThan, MoreThanOrEqual, Between } from 'typeorm';
import { CardSchema } from 'src/modules/cards/infrastructure/schemas/cards.schema';

@CommandHandler(MoveCardCommand)
export class MoveCardHandler implements ICommandHandler<MoveCardCommand> {
  constructor(
    private readonly cardRepository: TypeOrmCardRepository,
    private readonly columnRepository: TypeOrmColumnRepository,
    private readonly boardRepository: TypeOrmBoardRepository,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async execute(command: MoveCardCommand): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const card = await this.cardRepository.findById(
        CardUuid.fromString(command.cardId),
      );
      if (!card) throw new NotFoundException('Card not found');

      // Проверка прав через цепочку
      const column = await this.columnRepository.findById(
        ColumnUuid.fromString(card.columnId),
      );
      if (!column) throw new NotFoundException('Column not found');
      const board = await this.boardRepository.findById(
        BoardUuid.fromString(column.boardId),
      );
      if (!board) throw new NotFoundException('Board not found');
      if (board.userId !== command.userId) throw new ForbiddenException();

      const oldColumnId = card.columnId;
      const targetColumnId = command.targetColumnId;
      const oldPosition = card.position.getValue();
      const newPosition = command.newPosition;

      const cardRepo = queryRunner.manager.getRepository(CardSchema);

      if (oldColumnId !== targetColumnId) {
        // Уменьшить позиции в старой колонке
        await cardRepo.decrement(
          { columnId: oldColumnId, position: MoreThan(oldPosition) },
          'position',
          1,
        );
        // Увеличить позиции в новой колонке
        await cardRepo.increment(
          { columnId: targetColumnId, position: MoreThanOrEqual(newPosition) },
          'position',
          1,
        );
        // Обновить карточку
        await cardRepo.update(
          { uuid: card.uuid.toString() },
          { columnId: targetColumnId, position: newPosition },
        );
      } else {
        if (newPosition > oldPosition) {
          await cardRepo.decrement(
            {
              columnId: oldColumnId,
              position: Between(oldPosition + 1, newPosition),
            },
            'position',
            1,
          );
        } else if (newPosition < oldPosition) {
          await cardRepo.increment(
            {
              columnId: oldColumnId,
              position: Between(newPosition, oldPosition - 1),
            },
            'position',
            1,
          );
        }
        await cardRepo.update(
          { uuid: card.uuid.toString() },
          { position: newPosition },
        );
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}

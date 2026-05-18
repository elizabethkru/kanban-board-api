import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { TypeOrmCardRepository } from '../../modules/cards/infrastructure/repository/typeorm-card.repository';
import { TypeOrmColumnRepository } from '../../modules/columns/infrastructure/repository/typeorm-column.repository';
import { TypeOrmBoardRepository } from '../../modules/boards/infrastructure/repository/board.repository';
import { CardUuid } from '../../modules/cards/domain/value-objects/card-uuid.vo';
import { ColumnUuid } from '../../modules/columns/domain/value-objects/column-uuid.vo';
import { BoardUuid } from '../../modules/boards/domain/value-objects/board-uuid.vo';

@Injectable()
export class CardOwnerGuard implements CanActivate {
  constructor(
    private cardRepository: TypeOrmCardRepository,
    private columnRepository: TypeOrmColumnRepository,
    private boardRepository: TypeOrmBoardRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const cardId = request.params.cardId;
    if (!cardId) return false;

    const card = await this.cardRepository.findById(
      CardUuid.fromString(cardId),
    );
    if (!card) return false;

    const column = await this.columnRepository.findById(
      ColumnUuid.fromString(card.columnId),
    );
    if (!column) return false;

    const board = await this.boardRepository.findById(
      BoardUuid.fromString(column.boardId),
    );
    if (!board || board.userId !== user.uuid) {
      throw new ForbiddenException('You do not own this board');
    }
    return true;
  }
}

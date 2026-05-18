import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { TypeOrmColumnRepository } from '../../modules/columns/infrastructure/repository/typeorm-column.repository';
import { TypeOrmBoardRepository } from '../../modules/boards/infrastructure/repository/board.repository';
import { ColumnUuid } from '../../modules/columns/domain/value-objects/column-uuid.vo';
import { BoardUuid } from '../../modules/boards/domain/value-objects/board-uuid.vo';

@Injectable()
export class ColumnOwnerGuard implements CanActivate {
  constructor(
    private columnRepository: TypeOrmColumnRepository,
    private boardRepository: TypeOrmBoardRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const columnId = request.params.columnId || request.body.columnId;
    if (!columnId) return false;
    const column = await this.columnRepository.findById(
      ColumnUuid.fromString(columnId),
    );
    if (!column) return false;
    const board = await this.boardRepository.findById(
      BoardUuid.fromString(column.boardId),
    );
    if (!board || board.userId !== user.uuid)
      throw new ForbiddenException('You do not own this board');
    return true;
  }
}

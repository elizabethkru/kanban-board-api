import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { BoardRepository } from '../../modules/boards/infrastructure/repository/board.repository';

@Injectable()
export class BoardOwnerGuard implements CanActivate {
  constructor(private boardRepository: BoardRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const boardId = request.params.boardId;
    if (!boardId) return false;
    const board = await this.boardRepository.findById(boardId);
    if (!board || board.userId !== user.uuid) {
      throw new ForbiddenException('You do not own this board');
    }
    return true;
  }
}
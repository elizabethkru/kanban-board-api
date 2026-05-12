// src/common/guards/board-owner.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import * as boardRepositoryInterface from '../../modules/boards/ports/board.repository.interface';
import { BoardUuid } from '../../modules/boards/domain/value-objects/board-uuid.vo';
import type { IBoardRepository } from '../../modules/boards/ports/board.repository.interface';

@Injectable()
export class BoardOwnerGuard implements CanActivate {
  constructor(private readonly boardRepository: IBoardRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;          // { uuid, email } от JwtAuthGuard
    const boardId = request.params.boardId;
    if (!boardId) return false;

    const board = await this.boardRepository.findById(boardId);
    if (!board || board.userId !== user.uuid) {
      throw new ForbiddenException('You do not own this board');
    }
    return true;
  }
}
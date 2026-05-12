import { BoardAggregate } from '../domain/board.aggregate';
import { BoardUuid } from '../domain/value-objects/board-uuid.vo';

export interface IBoardRepository {
  save(board: BoardAggregate): Promise<BoardAggregate>;

  findById(uuid: BoardUuid): Promise<BoardAggregate | null>;

  findAllByUserId(userId: string): Promise<BoardAggregate[]>;

  delete(uuid: BoardUuid): Promise<void>;
}
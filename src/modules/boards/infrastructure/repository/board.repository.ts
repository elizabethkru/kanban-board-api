import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BoardSchema } from '../schemas/board.schema';
import { BoardAggregate } from '../../domain/board.aggregate';
import { IBoardRepository } from '../../ports/board.repository.interface';
import { BaseRepository } from 'src/modules/shared/ifrastructure/repositories/base.repository';
import { BoardUuid } from '../../domain/value-objects/board-uuid.vo';

@Injectable()
export class TypeOrmBoardRepository 
extends BaseRepository<BoardAggregate> 
implements IBoardRepository
{
  constructor(@InjectDataSource() connection: DataSource)
  {
    super(connection, BoardSchema);
  }
  findById(uuid: BoardUuid): Promise<BoardAggregate | null> {
    throw new Error('Method not implemented.');
  }
  findAllByUserId(userId: string): Promise<BoardAggregate[]> {
    throw new Error('Method not implemented.');
  }
  delete(uuid: BoardUuid): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async save(board: BoardAggregate): Promise<BoardAggregate> {
    return this.manager.save(board);
  }

}
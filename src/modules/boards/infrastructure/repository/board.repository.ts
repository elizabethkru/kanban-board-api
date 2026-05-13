import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BoardSchema } from '../schemas/board.schema';
import { BoardAggregate } from '../../domain/board.aggregate';
import { IBoardRepository } from '../../ports/board.repository.interface';
import { BaseRepository } from 'src/modules/shared/ifrastructure/repositories/base.repository';
import { BoardUuid } from '../../domain/value-objects/board-uuid.vo';
import { BoardTitle } from '../../domain/value-objects/board-title.vo';

@Injectable()
export class TypeOrmBoardRepository implements IBoardRepository {
  constructor(
    @InjectRepository(BoardSchema)
    private readonly ormRepo: Repository<BoardSchema>,
  ) {}

  async save(board: BoardAggregate): Promise<BoardAggregate> {
    const schema = this.ormRepo.create({
      uuid: board.uuid.toString(),
      title: board.title.getTitle(),
      userId: board.userId,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    });
    await this.ormRepo.save(schema);
    return board;
  }
  async findById(uuid: BoardUuid): Promise<BoardAggregate | null> {
    const schema = await this.ormRepo.findOneBy({ uuid: uuid.toString() });
    if (!schema) return null;
    return this.toDomain(schema);
  }

  async findAllByUserId(userId: string): Promise<BoardAggregate[]> {
    const schemas = await this.ormRepo.find({ where: { userId } });
    return schemas.map(s => this.toDomain(s));
  }

  async delete(uuid: BoardUuid): Promise<void> {
    await this.ormRepo.delete({ uuid: uuid.toString() });
  }

  // Метод для обновления – он не в интерфейсе, но может пригодиться для UpdateBoardHandler
  async update(board: BoardAggregate): Promise<BoardAggregate> {
    const schema = await this.ormRepo.findOneBy({ uuid: board.uuid.toString() });
    if (!schema) throw new Error('Board not found');
    schema.title = board.title.getTitle();
    schema.updatedAt = board.updatedAt;
    await this.ormRepo.save(schema);
    return board;
  }

  private toDomain(schema: BoardSchema): BoardAggregate {
    return BoardAggregate.reconstitute(
      BoardUuid.fromString(schema.uuid),
      new BoardTitle(schema.title),
      schema.userId,
      schema.createdAt,
      schema.updatedAt,
    );
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColumnAggregate } from '../../domain/column.aggregate';
import { IColumnRepository } from '../../ports/column.repository.interface';
import { ColumnUuid } from '../../domain/value-objects/column-uuid.vo';
import { ColumnPosition } from '../../domain/value-objects/column-position.vo';
import { ColumnTitle } from '../../domain/value-objects/colunm-title.vo';
import { ColumnSchema } from '../schemas/columns.schema';

@Injectable()
export class TypeOrmColumnRepository implements IColumnRepository {
  constructor(
    @InjectRepository(ColumnSchema)
    private readonly ormRepo: Repository<ColumnSchema>,
  ) {}

  async save(column: ColumnAggregate): Promise<ColumnAggregate> {
    const schema = this.ormRepo.create({
      uuid: column.uuid.toString(),
      title: column.title.getValue(),
      boardId: column.boardId,
      position: column.position.getValue(),
      createdAt: column.createdAt,
      updatedAt: column.updatedAt,
    });
    await this.ormRepo.save(schema);
    return column;
  }

  async update(column: ColumnAggregate): Promise<ColumnAggregate> {
    const schema = await this.ormRepo.findOneBy({
      uuid: column.uuid.toString(),
    });
    if (!schema) throw new Error('Column not found');
    schema.title = column.title.getValue();
    schema.position = column.position.getValue();
    schema.updatedAt = column.updatedAt;
    await this.ormRepo.save(schema);
    return column;
  }

  async findById(uuid: ColumnUuid): Promise<ColumnAggregate | null> {
    const schema = await this.ormRepo.findOneBy({ uuid: uuid.toString() });
    if (!schema) return null;
    return this.toDomain(schema);
  }

  async findByBoardId(boardId: string): Promise<ColumnAggregate[]> {
    const schemas = await this.ormRepo.find({
      where: { boardId },
      order: { position: 'ASC' },
    });
    return schemas.map((s) => this.toDomain(s));
  }

  async delete(uuid: ColumnUuid): Promise<void> {
    await this.ormRepo.delete({ uuid: uuid.toString() });
  }

  async getMaxPosition(boardId: string): Promise<number> {
    const result = await this.ormRepo
      .createQueryBuilder('column')
      .select('MAX(column.position)', 'max')
      .where('column.boardId = :boardId', { boardId })
      .getRawOne();
    return result?.max ?? -1;
  }

  private toDomain(schema: ColumnSchema): ColumnAggregate {
    return ColumnAggregate.reconstitute(
      ColumnUuid.fromString(schema.uuid),
      ColumnTitle.create(schema.title),
      schema.boardId,
      ColumnPosition.create(schema.position),
      schema.createdAt,
      schema.updatedAt,
    );
  }
}

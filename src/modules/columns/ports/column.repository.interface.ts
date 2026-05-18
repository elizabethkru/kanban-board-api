import { ColumnAggregate } from '../domain/column.aggregate';
import { ColumnUuid } from '../domain/value-objects/column-uuid.vo';

export interface IColumnRepository {
  save(column: ColumnAggregate): Promise<ColumnAggregate>;
  findById(uuid: ColumnUuid): Promise<ColumnAggregate | null>;
  findByBoardId(boardId: string): Promise<ColumnAggregate[]>;
  delete(uuid: ColumnUuid): Promise<void>;
  getMaxPosition(boardId: string): Promise<number>;
  update(column: ColumnAggregate): Promise<ColumnAggregate>;
}

import { AggregateRoot } from '@nestjs/cqrs';
import { ColumnUuid } from './value-objects/column-uuid.vo';
import { ColumnPosition } from './value-objects/column-position.vo';
import { ColumnTitle } from './value-objects/colunm-title.vo';

export class ColumnAggregate extends AggregateRoot {
  private constructor(
    private readonly _uuid: ColumnUuid,
    private _title: ColumnTitle,
    private readonly _boardId: string,
    private _position: ColumnPosition,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super();
  }

  static create(
    title: ColumnTitle,
    boardId: string,
    position: ColumnPosition,
  ): ColumnAggregate {
    const now = new Date();
    return new ColumnAggregate(
      ColumnUuid.generate(),
      title,
      boardId,
      position,
      now,
      now,
    );
  }

  static reconstitute(
    uuid: ColumnUuid,
    title: ColumnTitle,
    boardId: string,
    position: ColumnPosition,
    createdAt: Date,
    updatedAt: Date,
  ): ColumnAggregate {
    return new ColumnAggregate(
      uuid,
      title,
      boardId,
      position,
      createdAt,
      updatedAt,
    );
  }

  get uuid(): ColumnUuid {
    return this._uuid;
  }
  get title(): ColumnTitle {
    return this._title;
  }
  get boardId(): string {
    return this._boardId;
  }
  get position(): ColumnPosition {
    return this._position;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  changeTitle(newTitle: ColumnTitle): void {
    this._title = newTitle;
    this._updatedAt = new Date();
  }

  changePosition(newPosition: ColumnPosition): void {
    this._position = newPosition;
    this._updatedAt = new Date();
  }
}

import { AggregateRoot } from '@nestjs/cqrs';
import { CardUuid } from './value-objects/card-uuid.vo';
import { CardTitle } from './value-objects/card-title.vo';
import { CardDescription } from './value-objects/card-description.vo';
import { CardPosition } from './value-objects/card-position.vo';

export class CardAggregate extends AggregateRoot {
  private constructor(
    private readonly _uuid: CardUuid,
    private _title: CardTitle,
    private _description: CardDescription,
    private _columnId: string,
    private _position: CardPosition,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super();
  }

  static create(
    title: CardTitle,
    columnId: string,
    position: CardPosition,
    description?: CardDescription,
  ): CardAggregate {
    const now = new Date();
    return new CardAggregate(
      CardUuid.generate(),
      title,
      description || CardDescription.create(),
      columnId,
      position,
      now,
      now,
    );
  }

  static reconstitute(
    uuid: CardUuid,
    title: CardTitle,
    description: CardDescription,
    columnId: string,
    position: CardPosition,
    createdAt: Date,
    updatedAt: Date,
  ): CardAggregate {
    return new CardAggregate(
      uuid,
      title,
      description,
      columnId,
      position,
      createdAt,
      updatedAt,
    );
  }

  get uuid(): CardUuid {
    return this._uuid;
  }
  get title(): CardTitle {
    return this._title;
  }
  get description(): CardDescription {
    return this._description;
  }
  get columnId(): string {
    return this._columnId;
  }
  get position(): CardPosition {
    return this._position;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  changeTitle(newTitle: CardTitle): void {
    this._title = newTitle;
    this._updatedAt = new Date();
  }

  changeDescription(newDescription: CardDescription): void {
    this._description = newDescription;
    this._updatedAt = new Date();
  }

  changePosition(newPosition: CardPosition): void {
    this._position = newPosition;
    this._updatedAt = new Date();
  }

  moveTo(newColumnId: string, newPosition: CardPosition): void {
    this._columnId = newColumnId;
    this._position = newPosition;
    this._updatedAt = new Date();
  }
}

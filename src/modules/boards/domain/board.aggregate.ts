import { AggregateRoot } from '@nestjs/cqrs';
import { BoardUuid } from './value-objects/board-uuid.vo';
import { BoardTitle } from './value-objects/board-title.vo';

export class BoardAggregate extends AggregateRoot{
  private constructor(
    private readonly _uuid: BoardUuid,
    private _title: BoardTitle,
    private readonly _userId: string,   // пока оставим строкой, потом можно UserUuid VO
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super();
  }

  static create(
    title: BoardTitle, 
    userId: string): BoardAggregate {
    const now = new Date();
    return new BoardAggregate(
      BoardUuid.generate(),
      title,
      userId,
      now,
      now,
    );
  }

  static reconstitute(uuid: BoardUuid, title: BoardTitle, userId: string, createdAt: Date, updatedAt: Date): BoardAggregate {
    return new BoardAggregate(uuid, title, userId, createdAt, updatedAt);
  }

  // Геттеры — единственный способ читать данные
  get uuid(): BoardUuid { return this._uuid; }
  get title(): BoardTitle { return this._title; }
  get userId(): string { return this._userId; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Бизнес-метод для изменения названия
  changeTitle(newTitle: BoardTitle): void {
    this._title = newTitle;
    this._updatedAt = new Date();
  }
}
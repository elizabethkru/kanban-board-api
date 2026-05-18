import { CardAggregate } from '../domain/card.aggregate';
import { CardUuid } from '../domain/value-objects/card-uuid.vo';

export interface ICardRepository {
  save(card: CardAggregate): Promise<CardAggregate>;
  update(card: CardAggregate): Promise<CardAggregate>;
  findById(uuid: CardUuid): Promise<CardAggregate | null>;
  findByColumnId(columnId: string): Promise<CardAggregate[]>;
  delete(uuid: CardUuid): Promise<void>;
  getMaxPosition(columnId: string): Promise<number>;
}

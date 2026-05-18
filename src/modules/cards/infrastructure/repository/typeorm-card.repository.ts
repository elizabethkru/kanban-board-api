import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardAggregate } from '../../domain/card.aggregate';
import { ICardRepository } from '../../ports/card.repository.interface';
import { CardUuid } from '../../domain/value-objects/card-uuid.vo';
import { CardTitle } from '../../domain/value-objects/card-title.vo';
import { CardDescription } from '../../domain/value-objects/card-description.vo';
import { CardPosition } from '../../domain/value-objects/card-position.vo';
import { CardSchema } from '../schemas/cards.schema';

@Injectable()
export class TypeOrmCardRepository implements ICardRepository {
  constructor(
    @InjectRepository(CardSchema)
    private readonly ormRepo: Repository<CardSchema>,
  ) {}

  async save(card: CardAggregate): Promise<CardAggregate> {
    const schema = this.ormRepo.create({
      uuid: card.uuid.toString(),
      title: card.title.getValue(),
      description: card.description.getValue(),
      columnId: card.columnId,
      position: card.position.getValue(),
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    });
    await this.ormRepo.save(schema);
    return card;
  }

  async update(card: CardAggregate): Promise<CardAggregate> {
    const schema = await this.ormRepo.findOneBy({ uuid: card.uuid.toString() });
    if (!schema) throw new Error('Card not found');
    schema.title = card.title.getValue();
    schema.description = card.description.getValue();
    schema.columnId = card.columnId;
    schema.position = card.position.getValue();
    schema.updatedAt = card.updatedAt;
    await this.ormRepo.save(schema);
    return card;
  }

  async findById(uuid: CardUuid): Promise<CardAggregate | null> {
    const schema = await this.ormRepo.findOneBy({ uuid: uuid.toString() });
    if (!schema) return null;
    return this.toDomain(schema);
  }

  async findByColumnId(columnId: string): Promise<CardAggregate[]> {
    const schemas = await this.ormRepo.find({
      where: { columnId },
      order: { position: 'ASC' },
    });
    return schemas.map((s) => this.toDomain(s));
  }

  async delete(uuid: CardUuid): Promise<void> {
    await this.ormRepo.delete({ uuid: uuid.toString() });
  }

  async getMaxPosition(columnId: string): Promise<number> {
    const result = await this.ormRepo
      .createQueryBuilder('card')
      .select('MAX(card.position)', 'max')
      .where('card.columnId = :columnId', { columnId })
      .getRawOne();
    return result?.max ?? -1;
  }

  private toDomain(schema: CardSchema): CardAggregate {
    return CardAggregate.reconstitute(
      CardUuid.fromString(schema.uuid),
      CardTitle.create(schema.title),
      CardDescription.create(schema.description ?? undefined),
      schema.columnId,
      CardPosition.create(schema.position),
      schema.createdAt,
      schema.updatedAt,
    );
  }
}

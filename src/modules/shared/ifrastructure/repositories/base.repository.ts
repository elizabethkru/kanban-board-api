import {
  DataSource,
  EntityManager,
  EntitySchema,
  ObjectLiteral,
  QueryRunner,
} from 'typeorm';

export class BaseRepository<Schema extends ObjectLiteral> {
  readonly manager: EntityManager;
  readonly queryRunner?: QueryRunner;
  readonly entitySchema: EntitySchema<Schema>;

  constructor(connection: DataSource, entity: EntitySchema<Schema>) {
    this.queryRunner = connection.createQueryRunner();
    this.manager = this.queryRunner.manager;
    this.entitySchema = entity;
  }
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserSchema } from '../../../users/infrastructure/schemas/user.schema';
import { EntitySchema } from 'typeorm';
import { BoardAggregate } from '../../domain/board.aggregate';
import { BoardUuid } from '../../domain/value-objects/board-uuid.vo';
import { BoardTitle } from '../../domain/value-objects/board-title.vo';


export const BoardSchema = new EntitySchema<BoardAggregate>({
  name: 'Boards',
  columns: {

    uuid: {
      type: 'uuid',
      primary: true,

      transformer: {
      to: (value: BoardUuid) => value.toString(),
      from: (value: string) => new BoardUuid(value),
    }
  },
      title: {
      type: 'varchar',
      length: 255,
      transformer: {
        to: (value: BoardTitle) => value.getTitle(),
        from: (value: string) => new BoardTitle(value),
      },
    },
      userId: {
      type: 'uuid',
    },
        createdAt: {
      type: 'timestamptz',
      nullable: false,
      name: 'created_at',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updatedAt: {
      type: 'timestamptz',
      nullable: false,
      name: 'updated_at',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
}})
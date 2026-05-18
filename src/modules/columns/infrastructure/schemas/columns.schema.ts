import { BoardSchema } from 'src/modules/boards/infrastructure/schemas/board.schema';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('columns')
export class ColumnSchema {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ length: 50 })
  title: string;

  @Column('uuid')
  boardId: string;

  @Column({ type: 'int', default: 0 })
  position: number;

  @ManyToOne(() => BoardSchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId' })
  board: BoardSchema;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

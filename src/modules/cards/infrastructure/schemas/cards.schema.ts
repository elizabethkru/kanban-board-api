import { ColumnSchema } from 'src/modules/columns/infrastructure/schemas/columns.schema';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('cards')
export class CardSchema {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ length: 100 })
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string | null;

  @Column('uuid')
  columnId: string;

  @Column({ type: 'int' })
  position: number;

  @ManyToOne(() => ColumnSchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'columnId' })
  column: ColumnSchema;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

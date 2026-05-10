import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardSchema } from '../schemas/board.schema';

@Injectable()
export class BoardRepository {
  constructor(
    @InjectRepository(BoardSchema)
    private repo: Repository<BoardSchema>,
  ) {}

  async create(title: string, userId: string): Promise<BoardSchema> {
    const board = this.repo.create({ title, userId });
    return this.repo.save(board);
  }

  async findAllByUserId(userId: string): Promise<BoardSchema[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findById(uuid: string): Promise<BoardSchema | null> {
    return this.repo.findOneBy({ uuid });
  }

  async update(uuid: string, title: string): Promise<BoardSchema | null> {
    await this.repo.update(uuid, { title });
    return this.findById(uuid);
  }

  async delete(uuid: string): Promise<void> {
    await this.repo.delete(uuid);
  }
}
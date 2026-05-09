import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSchema } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private repo: Repository<UserSchema>,
  ) {}

  async create(email: string, passwordHash: string): Promise<UserSchema> {
    const user = this.repo.create({ email, passwordHash });
    return this.repo.save(user);
  }

  async findByEmail(email: string): Promise<UserSchema | null> {
    return this.repo.findOneBy({ email });
  }

  async findById(uuid: string): Promise<UserSchema | null> {
    return this.repo.findOneBy({ uuid });
  }
}
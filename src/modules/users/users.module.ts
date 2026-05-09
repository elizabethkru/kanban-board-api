import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { UserSchema } from './infrastructure/schemas/user.schema';
import { UserRepository } from './infrastructure/repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UsersModule {}
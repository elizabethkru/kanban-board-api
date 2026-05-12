import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { BoardsModule } from 'src/modules/boards/boards.module';
import { BoardsController } from './controllers/boards.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [AuthModule, BoardsModule, CqrsModule],
  controllers: [AuthController, BoardsController],
})
export class ApiModule {}
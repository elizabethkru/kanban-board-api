import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { BoardsModule } from 'src/modules/boards/boards.module';
import { BoardsController } from './controllers/boards.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ColumnsController } from './controllers/colums.controller';
import { ColumnsModule } from 'src/modules/columns/columns.module';

@Module({
  imports: [AuthModule, BoardsModule, ColumnsModule, CqrsModule],
  controllers: [AuthController, BoardsController, ColumnsController],
})
export class ApiModule {}

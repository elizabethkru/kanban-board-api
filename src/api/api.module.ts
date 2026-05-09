import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AuthController],
})
export class ApiModule {}
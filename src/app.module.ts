import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './modules/users/infrastructure/schemas/user.schema';
import { ApiModule } from './api/api.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { BoardsModule } from './modules/boards/boards.module';
import { BoardSchema } from './modules/boards/infrastructure/schemas/board.schema';
import { ColumnsModule } from './modules/columns/columns.module';
import { ColumnSchema } from './modules/columns/infrastructure/schemas/columns.schema';
import { CardsModule } from './modules/cards/cards.module';
import { CardSchema } from './modules/cards/infrastructure/schemas/cards.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [UserSchema, BoardSchema, ColumnSchema, CardSchema],
        synchronize: true, // обязательно false
        migrationsRun: true,
        logging: true,
      }),
    }),
    UsersModule,
    AuthModule,
    ApiModule,
    BoardsModule,
    ColumnsModule,
    CardsModule,
  ],
})
export class AppModule {}

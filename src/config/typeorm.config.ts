import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserSchema } from '../modules/users/infrastructure/schemas/user.schema';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  entities: [UserSchema],
  synchronize: false,      // запрещено, используем миграции
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
  logging: true,
});
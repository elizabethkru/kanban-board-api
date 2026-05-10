import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { UserSchema } from './modules/users/infrastructure/schemas/user.schema';

config(); // загружаем переменные из .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5433,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [UserSchema],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
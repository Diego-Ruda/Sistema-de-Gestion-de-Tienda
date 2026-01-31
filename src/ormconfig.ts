// import { AppDataSource } from './data-source';
// import * as dotenv from 'dotenv';
// import { join } from 'path';

// dotenv.config();

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: Number(process.env.DB_PORT) || 5432,
//   username: process.env.DB_USERNAME || 'postgres',
//   password: process.env.DB_PASSWORD || '3810',
//   database: process.env.DB_NAME || 'fastfood',
//   entities: [join(__dirname, '**/*.entity{.ts,.js}')],
//   migrations: [join(__dirname, 'src/migrations/*{.ts,.js}')],
//   synchronize: false, // Nunca true si usas migraciones
// });

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '3810',
  database: process.env.DB_NAME || 'fastfood',
  entities: [join(__dirname, '**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  synchronize: false,
});
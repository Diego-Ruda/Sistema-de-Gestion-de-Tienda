import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '3810',
  database: process.env.DB_NAME || 'fastfood',
  autoLoadEntities: true,
  synchronize: false,
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
};

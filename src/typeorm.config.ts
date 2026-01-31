import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
console.log({
  PGHOST: process.env.PGHOST,
  PGPORT: process.env.PGPORT,
});

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
  autoLoadEntities: true,
  synchronize: false,
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
};

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',   // usuario
  password: '3810',    // contraseña
  database: 'fastfood',   // El nombre de la base de datos
  autoLoadEntities: true, 
  synchronize: true,      
  logging: true,
  logger: 'advanced-console',
};
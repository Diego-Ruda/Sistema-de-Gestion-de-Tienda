import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { Producto } from './productos/producto.entity';
import { Venta } from './ventas/venta.entity';
import { ProductosModule } from './productos/productos.module';
import { VentasModule } from './ventas/ventas.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '3810',
      database: 'fastfood',
      entities: [Producto, Venta],
      synchronize: true,
    }),

    ProductosModule,
    VentasModule,
    ReportesModule,
  ],
})
export class AppModule {}

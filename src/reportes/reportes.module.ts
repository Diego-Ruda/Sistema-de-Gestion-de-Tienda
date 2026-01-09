import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { Producto } from 'src/productos/producto.entity';
import { Venta } from 'src/ventas/venta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Venta])
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
  exports: [ReportesService]   //
})
export class ReportesModule {}

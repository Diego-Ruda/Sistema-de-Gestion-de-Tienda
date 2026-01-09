import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Venta } from './venta.entity'; 
import { Producto } from 'src/productos/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, Producto])], // permite que TypeORM use la entidad Venta
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}

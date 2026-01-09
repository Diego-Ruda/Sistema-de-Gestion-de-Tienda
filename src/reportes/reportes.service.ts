import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../productos/producto.entity';
import { Venta } from '../ventas/venta.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepo: Repository<Producto>,

    @InjectRepository(Venta)
    private readonly ventasRepo: Repository<Venta>,
  ) {}

  // ============================
  //        VENTAS TOTALES
  // ============================
  async ventasTotales(): Promise<{ total: number }> {
    const ventas = await this.ventasRepo.find();

    const total = ventas.reduce(
      (acc, venta) => acc + Number(venta.total),
      0,
    );

    return { total };
  }

  // ============================
  //     PRODUCTO MÁS VENDIDO
  // ============================
  async productoMasVendido(): Promise<{
    productoId: number;
    nombre: string;
    cantidad: number;
  }> {
    const ventas = await this.ventasRepo.find();
    const contador = new Map<number, number>();

    for (const venta of ventas) {
      for (const item of venta.productos) {
        const actual = contador.get(item.productoId) ?? 0;
        contador.set(item.productoId, actual + item.cantidad);
      }
    }

    let productoId = 0;
    let cantidad = 0;

    for (const [id, cant] of contador.entries()) {
      if (cant > cantidad) {
        productoId = id;
        cantidad = cant;
      }
    }

    if (productoId === 0) {
      return {
        productoId: 0,
        nombre: 'Sin ventas',
        cantidad: 0,
      };
    }

    const producto = await this.productosRepo.findOne({
      where: { id: productoId },
    });

    return {
      productoId,
      nombre: producto?.nombre ?? 'Producto eliminado',
      cantidad,
    };
  }
}

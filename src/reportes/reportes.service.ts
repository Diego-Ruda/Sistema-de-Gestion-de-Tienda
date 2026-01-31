import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
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

  /* 
  =================================
        FUNCIONES DE FECHAS
  =================================
  */

  private inicioDelDia() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private finDelDia() {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  }

  private inicioSemana() {
    const hoy = new Date();
    const dia = hoy.getDay();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - (dia === 0 ? 6 : dia - 1));
    lunes.setHours(0, 0, 0, 0);
    return lunes;
  }

  private finSemana() {
    const inicio = this.inicioSemana();
    const domingo = new Date(inicio);
    domingo.setDate(inicio.getDate() + 6);
    domingo.setHours(23, 59, 59, 999);
    return domingo;
  }

  private inicioMes() {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private finMes() {
    const inicio = this.inicioMes();
    const d = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 0);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  /* 
  ==========================
        VENTAS TOTALES
  ========================== 
  */
  async ventasDelDia() {
    return this.ventasPorRango(this.inicioDelDia(), this.finDelDia());
  }

  async ventasSemana() {
    return this.ventasPorRango(this.inicioSemana(), this.finSemana());
  }

  async ventasMes() {
    return this.ventasPorRango(this.inicioMes(), this.finMes());
  }

  private async ventasPorRango(inicio: Date, fin: Date) {
    const ventas = await this.ventasRepo.find({
      where: { fecha: Between(inicio, fin) },
    });

    const total = ventas.reduce((acc, v) => acc + Number(v.total), 0);
    return { total };
  }

  /* =====================================================
        PRODUCTO MÁS VENDIDO
  ===================================================== */
  
  async productoMasVendidoDelDia() {
    const ventas = await this.ventasRepo.find({
      where: {
        fecha: Between(this.inicioDelDia(), this.finDelDia()),
      },
    });
    return this.calcularProductoMasVendido(ventas);
  }

  async productoMasVendidoSemana() {
    const ventas = await this.ventasRepo.find({
      where: {
        fecha: Between(this.inicioSemana(), this.finSemana()),
      },
    });
    return this.calcularProductoMasVendido(ventas);
  }

  async productoMasVendidoMes() {
    const ventas = await this.ventasRepo.find({
      where: {
        fecha: Between(this.inicioMes(), this.finMes()),
      },
    });
    return this.calcularProductoMasVendido(ventas);
  }

  /* 
  ==============================================
          LÓGICA CENTRAL (REUTILIZABLE)
  ==============================================
  */

  private async calcularProductoMasVendido(ventas: Venta[]) {
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

    if (!productoId) {
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

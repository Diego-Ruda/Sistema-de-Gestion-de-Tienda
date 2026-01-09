import { Controller, Get } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('reportes')
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  // ==========================
  //      Ventas totales
  // ==========================
  @Get('ventas-totales')
  obtenerVentasTotales() {
    return this.reportesService.ventasTotales();
  }

  // ============================
  //    Producto mas vendido
  // ============================
  @Get('producto-mas-vendido')
  obtenerProductoMasVendido() {
    return this.reportesService.productoMasVendido();
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@ApiTags('reportes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  // ==========================
  //        VENTAS
  // ==========================
  @Get('ventas-dia')
  ventasDia() {
    return this.reportesService.ventasDelDia();
  }

  @Get('ventas-semana')
  ventasSemana() {
    return this.reportesService.ventasSemana();
  }

  @Get('ventas-mes')
  ventasMes() {
    return this.reportesService.ventasMes();
  }

  // ==========================
  //   PRODUCTO MÁS VENDIDO
  // ==========================
  @Get('producto-mas-vendido-dia')
  productoMasVendidoDia() {
    return this.reportesService.productoMasVendidoDelDia();
  }

  @Get('producto-mas-vendido-semana')
  productoMasVendidoSemana() {
    return this.reportesService.productoMasVendidoSemana();
  }

  @Get('producto-mas-vendido-mes')
  productoMasVendidoMes() {
    return this.reportesService.productoMasVendidoMes();
  }
}

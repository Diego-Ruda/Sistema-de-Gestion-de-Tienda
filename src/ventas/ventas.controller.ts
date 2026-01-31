import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-ventas.dto';
import { Venta } from './venta.entity';
import { UpdateVentaDto } from './dto/update-ventas.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Ventas')
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  // Crear una venta
  @ApiOperation({ summary: 'Registrar una nueva venta' })
  @ApiResponse({
    status: 201,
    description: 'Venta creada correctamente',
    type: Venta,
  })
  @Post()
  @Roles(Role.EMPLEADO, Role.ADMIN)
  async create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventasService.create(createVentaDto);
  }

  // Obtener todas las ventas
  @ApiOperation({ summary: 'Obtener todas las ventas' })
  @ApiResponse({
    status: 200,
    description: 'Listado de ventas',
    type: [Venta],
  })
  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    return this.ventasService.findAll();
  }

  // Obtener venta por ID
  @ApiOperation({ summary: 'Obtener una venta por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Venta encontrada',
    type: Venta,
  })
  @ApiResponse({
    status: 404,
    description: 'Venta no encontrada',
  })
  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }

  // Eliminar venta por ID
  @ApiOperation({ summary: 'Eliminar una venta' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Venta eliminada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Venta no encontrada',
  })
  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.remove(id);
  }

  // Actualizar una venta
  @ApiOperation({ summary: 'Actualizar una venta' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Venta actualizada correctamente',
    type: Venta,
  })
  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVentaDto: UpdateVentaDto,
  ) {
    return this.ventasService.update(id, updateVentaDto);
  }
}

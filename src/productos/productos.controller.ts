import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './producto.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // ===============================
  //     PRODUCTOS DISPONIBLES
  // ===============================
  @ApiOperation({ summary: 'Obtener productos disponibles (stock > 0)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos disponibles',
    type: [Producto],
  })
  @Get('disponibles')
  obtenerDisponibles(): Promise<Producto[]> {
    return this.productosService.obtenerDisponibles();
  }

  // ===============================
  //     -TODOS LOS PRODUCTOS-
  // ===============================
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos',
    type: [Producto],
  })
  @Get()
  obtenerTodos(): Promise<Producto[]> {
    return this.productosService.obtenerTodos();
  }

  // ===============================
  //       PRODUCTO POR ID
  // ===============================
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
    type: Producto,
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  @Get(':id')
  async obtenerUno(
    @Param('id', ParseIntPipe) id: number
  ): Promise<Producto> {
    const producto = await this.productosService.obtenerPorId(id);
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return producto;
  }

  // ==============================
  //        CREAR PRODUCTO
  // ==============================
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({
    status: 201,
    description: 'Producto creado correctamente',
    type: Producto,
  })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  agregar(@Body() data: CreateProductoDto): Promise<Producto> {
    return this.productosService.agregarProducto(data);
  }

  // ===============================
  //      ACTUALIZAR PRODUCTO
  // ===============================
  @ApiOperation({ summary: 'Actualizar un producto existente' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado correctamente',
    type: Producto,
  })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() cambios: UpdateProductoDto
  ): Promise<Producto> {
    return this.productosService.actualizarProducto(id, cambios);
  }

  // =============================
  //      ELIMINAR PRODUCTO
  // =============================
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Producto eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async eliminar(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ mensaje: string }> {
    const eliminado = await this.productosService.eliminarProducto(id);

    if (!eliminado) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    return { mensaje: 'Producto eliminado correctamente' };
  }
}

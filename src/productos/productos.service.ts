import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly repo: Repository<Producto>,
  ) {}

  // ===================================
  //      OBTENER TODOS LOS PRODUCTOS
  // ===================================
  obtenerTodos(): Promise<Producto[]> {
    return this.repo.find();
  }

  // =====================================
  //      OBTENES PRODUCTOS DISPONIBLES
  // =====================================
  obtenerDisponibles(): Promise<Producto[]> {
    return this.repo.find({
      where: { stock: MoreThan(0) },
      order: { nombre: 'ASC' },
    });
  }

  async obtenerPorId(id: number): Promise<Producto | null> {
    return await this.repo.findOne({ where: { id } });
  }

  // =============================
  //      AGREGAR PRODUCTOS
  // =============================

  async agregarProducto(data: CreateProductoDto): Promise<Producto> {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  // ===================================
  //      ACTUALIZAR/EDITAR PRODUCTOS
  // ===================================
  async actualizarProducto(id: number, cambios: UpdateProductoDto): Promise<Producto> {
    const producto = await this.repo.findOne({ where: { id } });

    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    const actualizado = Object.assign(producto, cambios);
    return await this.repo.save(actualizado);
  }

  // =============================
  //      ELIMINAR PRODUCTOS
  // =============================
  async eliminarProducto(id: number): Promise<boolean> {
    const resultado = await this.repo.delete(id);
    return !!resultado.affected && resultado.affected > 0;
  }
}

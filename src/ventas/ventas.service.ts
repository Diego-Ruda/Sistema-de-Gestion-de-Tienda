import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './venta.entity';
import { Producto } from '../productos/producto.entity';
import { CreateVentaDto } from './dto/create-ventas.dto';
import { UpdateVentaDto } from './dto/update-ventas.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventasRepository: Repository<Venta>,

    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    let total = 0;

    // recorrer productos vendidos
    for (const item of createVentaDto.productos) {
      const producto = await this.productosRepository.findOne({
        where: { id: item.productoId },
      });

      //producto inexistente
      if (!producto) {
        throw new NotFoundException(
          `Producto con ID ${item.productoId} no existe`,
        );
      }

      //stock insuficiente
      if (producto.stock < item.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para ${producto.nombre}`,
        );
      }

      //sumar total
      total += producto.precio * item.cantidad;

      //descontar stock
      producto.stock -= item.cantidad;
      await this.productosRepository.save(producto);
    }

    // crear venta
    const venta = this.ventasRepository.create({
      ...createVentaDto,
      total,
      fecha: new Date(),
    });

    return this.ventasRepository.save(venta);
  }

  findAll() {
    return this.ventasRepository.find();
  }

  async findOne(id: number) {
    const venta = await this.ventasRepository.findOne({ where: { id } });
    if (!venta) {
      throw new NotFoundException('Venta no encontrada');
    }
    return venta;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto) {
    const venta = await this.findOne(id);
    Object.assign(venta, updateVentaDto);
    return this.ventasRepository.save(venta);
  }

  async remove(id: number) {
    const venta = await this.findOne(id);
    return this.ventasRepository.remove(venta);
  }
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, VersionColumn } from 'typeorm';

@Entity()
export class Venta {
  @PrimaryGeneratedColumn()
  id!: number;

  // Guardamos un arreglo de productos con su cantidad
  @Column('json')
  productos!: { productoId: number; cantidad: number }[];

  // Total de la venta
  @Column('decimal', { precision: 10, scale: 2 })
  total!: number;

  // Cliente opcional
  @Column({ nullable: true })
  cliente?: string;

  // Fecha de creación automática
  @CreateDateColumn()
  fecha!: Date;

  // Version para el optimistic lock
  @VersionColumn()
  version!: number;
}

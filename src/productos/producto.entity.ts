import { Entity, PrimaryGeneratedColumn, Column, VersionColumn } from 'typeorm';

@Entity({ name: 'producto' })
export class Producto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio!: number;

  @Column()
  stock!: number;

  @VersionColumn() // Optimistic lock
  version!: number;

  @Column({ nullable: true }) // <-- nuevo campo
  descripcion!: string;
}

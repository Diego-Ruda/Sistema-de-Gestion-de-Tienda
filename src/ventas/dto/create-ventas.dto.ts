// src/ventas/dto/create-venta.dto.ts
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProductoVenta {
  @IsNumber()
  productoId!: number;

  @IsNumber()
  cantidad!: number;
}

export class CreateVentaDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoVenta)
  productos!: ProductoVenta[];

  @IsOptional()
  @IsString()
  cliente?: string;
}

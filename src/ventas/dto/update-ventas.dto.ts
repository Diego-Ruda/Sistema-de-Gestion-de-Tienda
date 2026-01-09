import { PartialType } from '@nestjs/mapped-types';
import { CreateVentaDto } from './create-ventas.dto';

export class UpdateVentaDto extends PartialType(CreateVentaDto) {}

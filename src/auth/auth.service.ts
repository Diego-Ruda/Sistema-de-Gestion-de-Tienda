import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Empleado)
    private empleadoRepo: Repository<Empleado>,
  ) {}

  async login(numeroEmpleado: string, password: string) {
    const empleado = await this.empleadoRepo.findOne({ where: { numeroEmpleado } });

    if (!empleado) throw new UnauthorizedException('Credenciales inválidas');

    const match = await bcrypt.compare(password, empleado.password);
    if (!match) throw new UnauthorizedException('Credenciales inválidas');

    const payload = {
      sub: empleado.id,
      numeroEmpleado: empleado.numeroEmpleado,
      rol: empleado.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

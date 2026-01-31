import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Empleado } from './auth/user.entity';
import { Role } from './auth/roles.enum';

export async function seedEmpleados(dataSource: DataSource) {
  const empleadoRepo = dataSource.getRepository(Empleado);

  const existe = await empleadoRepo.findOne({
    where: { numeroEmpleado: '1000' },
  });

  if (existe) {
    console.log('Empleados ya existen');
    return;
  }

  // crear credenciales Admin
  const admin = empleadoRepo.create({
    numeroEmpleado: '1000',
    password: await bcrypt.hash('admin123', 10),
    rol: Role.ADMIN,
  });

  // crear credenciales empleado
  const empleado = empleadoRepo.create({
    numeroEmpleado: '2000',
    password: await bcrypt.hash('empleado123', 10),
    rol: Role.EMPLEADO,
  });

  await empleadoRepo.save([admin, empleado]);

  console.log('Admin y empleado creados');
}

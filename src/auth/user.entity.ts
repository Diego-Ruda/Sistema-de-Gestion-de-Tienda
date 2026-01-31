import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./roles.enum";

@Entity('empleados')
export class Empleado{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true})
    numeroEmpleado!: string;

    @Column()
    password!: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.EMPLEADO,
    })

    rol!: Role;
}
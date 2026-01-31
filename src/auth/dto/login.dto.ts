import { IsNumberString, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNumberString()
  numeroEmpleado!: string;

  @IsString()
  @MinLength(4)
  password!: string;
}

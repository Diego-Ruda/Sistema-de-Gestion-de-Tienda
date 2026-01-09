import { IsString,IsNumber,Min,IsInt} from "class-validator";

export class CreateProductoDto{
    @IsString()
    nombre:string;

    @IsNumber()
    @Min(0)
    precio:number;

    @IsInt()
    @Min(0)
    stock:number;
}
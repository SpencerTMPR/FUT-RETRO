
import { IsString, IsEmail, IsNotEmpty, IsNumber, Length, IsOptional } from "class-validator";

export class CreateProductDto {
    
    @Length(3, 50)
    @IsString()
    @IsNotEmpty()
    public name!: string;

    @IsString()
    @IsNotEmpty()
    public img!: string;

    @IsNumber()
    @IsNotEmpty()
    public price!: string;

    @IsEmail()
    @IsNotEmpty()
    public email_company!: string;

    @IsString()
    @IsOptional()
    public _id_company!: string;

} 

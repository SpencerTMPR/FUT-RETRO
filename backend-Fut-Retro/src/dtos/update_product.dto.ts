
import { IsString, IsEmail, IsNotEmpty, IsNumber, Length, IsOptional } from "class-validator";

export class UpdateProductDto {
    
    @Length(3, 50)
    @IsString()
    @IsOptional()
    public name!: string;

    @IsString()
    @IsOptional()
    public img!: string;

    @IsNumber()
    @IsOptional()
    public price!: string;

    @IsEmail()
    @IsOptional()
    public email_company!: string;

    @IsString()
    @IsOptional()
    public _id_company!: string;

} 

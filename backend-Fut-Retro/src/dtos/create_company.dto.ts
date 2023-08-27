
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateCompanyDto {

    @Length(3, 50)
    @IsString()
    @IsNotEmpty()
    public name!: string;

    @IsEmail()
    @IsNotEmpty()
    public email!: string;

    @IsNumber()
    @IsNotEmpty()
    public phone!: number;

    @Length(3, 100)
    @IsString()
    @IsNotEmpty()
    public address!: string;

    @IsString()
    @IsNotEmpty()
    public logo!: string;

    @IsString()
    @IsNotEmpty()
    public banner!: string;

    @Length(3, 100)
    @IsString()
    @IsNotEmpty()
    public description!: string;

    @IsNumber()
    @IsOptional()
    public rating!: number;

    @IsString()
    @IsNotEmpty()
    public category!: string;
    
}

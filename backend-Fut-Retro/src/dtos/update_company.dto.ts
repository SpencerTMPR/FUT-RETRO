
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class UpdateCompanyDto {

    @Length(3, 50)
    @IsString()
    @IsOptional()
    public name!: string;

    @IsEmail()
    @IsOptional()
    public email!: string;

    @IsNumber()
    @IsOptional()
    public phone!: number;

    @Length(3, 100)
    @IsString()
    @IsOptional()
    public address!: string;

    @IsString()
    @IsOptional()
    public logo!: string;

    @IsString()
    @IsOptional()
    public banner!: string;

    @Length(3, 100)
    @IsString()
    @IsOptional()
    public description!: string;

    @IsNumber()
    @IsOptional()
    public rating!: number;

    @IsString()
    @IsOptional()
    public category!: string;
    
}

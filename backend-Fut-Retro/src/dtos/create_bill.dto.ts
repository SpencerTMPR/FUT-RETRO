
import { IsString, IsEmail, IsNotEmpty, IsNumber, Length, IsDate, IsBoolean, IsOptional, IsArray } from "class-validator";

export class CreateBillDto {
  
    @IsString()
    @IsNotEmpty()
    public date!: string;

    @IsArray()
    @IsOptional()
    public list_products!: [];
    
    @IsNumber()
    @IsOptional()
    public subtotal!: number;

    @IsNumber()
    @IsOptional()
    public isv!: number;

    @IsNumber()
    @IsOptional()
    public commissions!: {
        motorist_commissions: number,
        administration_commissions: number,
        total_commissions: number
    };

    @IsNumber()
    @IsOptional()
    public total!: number;

    @IsString()
    @IsNotEmpty()
    public address!: string;

    @IsString()
    @IsOptional()
    public _id_user!: string;

} 

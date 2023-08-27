
import { IsString, IsEmail, IsNotEmpty, IsNumber, Length, IsOptional } from "class-validator";

export class UpdateInfoUserDto {

    @Length(3, 50)
    @IsString()
    @IsOptional()
    public name!: string;
    
    @IsNumber()
    @IsOptional()
    public phone!: number;

    @IsString()   
    @IsOptional()
    public img_profile!: string;

    @IsString()   
    @IsOptional()
    public role!: string;

    @IsString()  
    @IsOptional()
    public _id_role!: string;

} 

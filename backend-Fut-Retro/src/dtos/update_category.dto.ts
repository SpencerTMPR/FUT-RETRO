
import { IsString, IsEmail, IsNotEmpty, IsNumber, Length, IsOptional } from "class-validator";

export class UpdateCategoryDto {
    
    @Length(3, 50)
    @IsString()
    @IsOptional()
    public name!: string;

    @IsString()
    @IsOptional()
    public img!: string;

} 

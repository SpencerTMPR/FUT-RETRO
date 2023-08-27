
import { IsString, IsEmail, IsNotEmpty, IsNumber, Length } from "class-validator";

export class CreateCategoryDto {
    
    @Length(3, 50)
    @IsString()
    @IsNotEmpty()
    public name!: string;

    @IsString()
    @IsNotEmpty()
    public img!: string;

} 

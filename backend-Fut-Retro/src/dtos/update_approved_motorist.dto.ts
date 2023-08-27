
import { IsString, IsEmail, IsNotEmpty, IsNumber, Length, IsOptional, IsBoolean } from "class-validator";

export class UpdateApprovedMotoristDto {

    @Length(3, 100)
    @IsEmail()
    @IsNotEmpty()
    public email!: string;

    @IsBoolean()
    @IsNotEmpty()
    public approved!: boolean;

} 

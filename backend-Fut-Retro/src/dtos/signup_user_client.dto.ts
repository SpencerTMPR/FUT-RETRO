
import { IsString, IsEmail, IsNotEmpty, IsNumber, Length, IsOptional } from "class-validator";

export class SignupUserClientDto {

    @Length(3, 50)
    @IsString()
    @IsNotEmpty()
    public name!: string;
    
    @IsNumber()
    @IsNotEmpty()
    public phone!: number;

    @Length(3, 100)
    @IsEmail()
    @IsNotEmpty()
    public email!: string;

    @Length(2, 100)
    @IsString()
    @IsNotEmpty()
    public password!: string;
    
    @Length(2, 100)
    @IsString()
    @IsNotEmpty()
    public confirm_password!: string; 

    @IsString()
    @IsOptional()
    public img_profile!: string;

    @IsString()
    public role: string = 'Client';

} 

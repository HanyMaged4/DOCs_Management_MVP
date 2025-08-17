import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignUpDto {

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    sec_password ?: string; // Optional for home page lock

} 
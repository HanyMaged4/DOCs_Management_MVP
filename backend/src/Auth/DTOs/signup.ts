import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {

    @ApiProperty({ description: 'User username', example: 'john_doe' })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ description: 'User email address', example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value?.toLowerCase().trim())
    email: string;

    @ApiProperty({ description: 'User password', example: 'password123' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @ApiProperty({ description: 'User secondary password', example: 'password123' })
    @IsString()
    @IsOptional()
    sec_password ?: string; // Optional for home page lock

} 
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
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

  
}
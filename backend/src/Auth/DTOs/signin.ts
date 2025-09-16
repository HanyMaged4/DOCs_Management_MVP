import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Transform } from 'class-transformer';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })

  password: string;

  
}
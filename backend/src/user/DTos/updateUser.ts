import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: 'Username must be a string' })
    username?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    email?: string;

    @IsOptional()
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password?: string;

    @IsOptional()
    @IsString({ message: 'Security password must be a string' })
    @MinLength(6, { message: 'Security password must be at least 6 characters long' })
    sec_password?: string;
}

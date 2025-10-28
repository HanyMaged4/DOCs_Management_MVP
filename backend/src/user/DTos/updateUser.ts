import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ description: 'User username', example: 'john_doe' })
    @IsOptional()
    @IsString({ message: 'Username must be a string' })
    username?: string;
    
    @ApiProperty({ description: 'User email address', example: 'user@example.com' })
    @IsOptional()
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    email?: string;

    @ApiProperty({ description: 'User password', example: 'password123' })
    @IsOptional()
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password?: string;
    
    @ApiProperty({ description: 'User security password', example: 'password123' })
    @IsOptional()
    @IsString({ message: 'Security password must be a string' })
    // @MinLength(6, { message: 'Security password must be at least 6 characters long' })
    sec_password?: string;
}

import { 
    IsString, 
    IsNotEmpty, 
    IsOptional, 
    Length, 
    Matches,
    MinLength,
    MaxLength
  } from "class-validator";

  import { Transform } from "class-transformer";
  import { ApiProperty } from '@nestjs/swagger';

  export class CreateBookDto {

      @ApiProperty({ description: 'Title of the book', example: 'The Great Gatsby' })
      @IsNotEmpty({ message: 'Title is required' })
      @IsString({ message: 'Title must be a string' })
      @Length(1, 100, { message: 'Title must be between 1 and 100 characters' })
      @Transform(({ value }) => value?.trim())
      @Matches(/^[a-zA-Z0-9\s\-_.,!?()]+$/, { 
          message: 'Title contains invalid characters' 
      })
      title: string;
      
      @ApiProperty({ description: 'Description of the book', example: 'A classic novel set in the 1920s...' })
      @IsOptional()
      @IsString({ message: 'Description must be a string' })
      @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
      @Transform(({ value }) => value?.trim())
      description?: string;
      
      @ApiProperty({ description: 'Security password for the book', example: 'securePass123' })
      @IsOptional()
      @IsString({ message: 'Security password must be a string' })
    //   @MinLength(6, { message: 'Security password must be at least 6 characters' })
      @MaxLength(50, { message: 'Security password cannot exceed 50 characters' })
      sec_password?: string;
  }
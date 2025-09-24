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
  
  export class CreateBookDto {
  
      @IsNotEmpty({ message: 'Title is required' })
      @IsString({ message: 'Title must be a string' })
      @Length(1, 100, { message: 'Title must be between 1 and 100 characters' })
      @Transform(({ value }) => value?.trim())
      @Matches(/^[a-zA-Z0-9\s\-_.,!?()]+$/, { 
          message: 'Title contains invalid characters' 
      })
      title: string;
  
      @IsOptional()
      @IsString({ message: 'Description must be a string' })
      @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
      @Transform(({ value }) => value?.trim())
      description?: string;
      
      @IsOptional()
      @IsString({ message: 'Security password must be a string' })
    //   @MinLength(6, { message: 'Security password must be at least 6 characters' })
      @MaxLength(50, { message: 'Security password cannot exceed 50 characters' })
      sec_password?: string;
  }
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateEntityDto {
    @IsNumber()
    @IsNotEmpty({ message: 'Book ID is required' })
    book_id: number;

    @IsString({ message: 'Tag title must be a string' })
    @IsNotEmpty({ message: 'Tag title is required' })
    @Length(1, 50, { message: 'Tag title must be between 1 and 50 characters' })
    title: string;
    
    @IsOptional()
    @Length(0, 5000, { message: 'Content must be at most 5000 characters' })
    content: string; 
    
    @IsOptional()
    @IsNumber({}, { each: true, message: 'Tags must be an array of numbers' })
    tags: string[];

}
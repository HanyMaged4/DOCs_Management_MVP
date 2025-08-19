import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class UpdateEntityDto {
    @IsOptional()
    @IsNumber()
    book_id: number;

    @IsOptional()
    @IsString({ message: 'Tag title must be a string' })
    @Length(1, 50, { message: 'Tag title must be between 1 and 50 characters' })
    title: string;
    
    @IsOptional()
    @Length(0, 5000, { message: 'Content must be at most 5000 characters' })
    content: string; 

    @IsOptional()
    @IsNumber({}, { each: true, message: 'Tags must be an array of numbers' })
    tags: string[];
}

// src/entity/dto/create-entity.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { Transform, Type } from "class-transformer";

export class CreateEntityDto {
    @Transform(({ value }) => {
        console.log('Transforming book_id:', value, typeof value);
        if (value === null || value === undefined || value === '') {
            return undefined;
        }
        const num = Number(value);
        return isNaN(num) ? value : num;
    })
    @Type(() => Number)
    @IsNumber({}, { message: 'book_id must be a number conforming to the specified constraints' })
    @IsNotEmpty({ message: 'Book ID is required' })
    book_id: number;

    @Transform(({ value }) => {
        console.log('Transforming title:', value, typeof value);
        if (value === null || value === undefined) {
            return undefined;
        }
        return typeof value === 'string' ? value.trim() : String(value);
    })
    @IsString({ message: 'Title must be a string' })
    @IsNotEmpty({ message: 'Title is required' })
    @Length(1, 50, { message: 'Title must be between 1 and 50 characters' })
    title: string;
    
    @IsOptional()
    @Transform(({ value }) => {
        console.log('Transforming content:', value, typeof value);
        if (value === null || value === undefined || value === '') {
            return undefined;
        }
        return typeof value === 'string' ? value.trim() : String(value);
    })
    @IsString({ message: 'Content must be a string' })
    @Length(0, 5000, { message: 'Content must be at most 5000 characters' })
    content?: string; 
    
    @IsOptional()
    @Transform(({ value }) => {
        console.log('Transforming tags:', value, typeof value);
        if (!value || value === '' || value === 'undefined') {
            return undefined;
        }
        if (Array.isArray(value)) {
            return value.map(id => Number(id)).filter(id => !isNaN(id));
        }
        if (typeof value === 'string') {
            return value.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
        }
        return undefined;
    })
    tags?: number[];
    
    // No validation for attachments - handled by multer
    attachments?: Express.Multer.File[];
}
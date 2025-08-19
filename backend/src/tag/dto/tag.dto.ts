import { IsNotEmpty, IsString, Length } from "class-validator";

export class TagDto {
    @IsString({ message: 'Tag title must be a string' })
    @IsNotEmpty({ message: 'Tag title is required' })
    @Length(1, 50, { message: 'Tag title must be between 1 and 50 characters' })
    tag_title: string;
}